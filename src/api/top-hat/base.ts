import { EndpointData } from "src/common/models";
import {
    getEnvValue,
    loadStorageState,
    saveStorageState,
    setEnvValue,
} from "../secrets";
import { chromium, Request } from "playwright";
import { IpcMainInvokeEvent } from "electron";

const LIBERTY_USERNAME_SECRET_NAME = "LIBERTY_USERNAME";
const LIBERTY_PASSWORD_SECRET_NAME = "LIBERTY_PASSWORD";
const AUTH_REQUEST_KEY_NAME = "th_jwt_refresh";
const AUTH_KEY_SECRET_NAME = "TH_AUTH_KEY";

export interface LibertyCredentials {
    libertyUsername: string;
    libertyPassword: string;
}

export const getLibertyCredentials = async (): Promise<LibertyCredentials> => {
    const libertyUsername = await getEnvValue(LIBERTY_USERNAME_SECRET_NAME);
    const libertyPassword = await getEnvValue(LIBERTY_PASSWORD_SECRET_NAME);

    return {
        libertyUsername: libertyUsername,
        libertyPassword: libertyPassword,
    };
};

export const setLibertyCredentials = async (
    nextCredentials: LibertyCredentials,
): Promise<void> => {
    await setEnvValue(
        LIBERTY_USERNAME_SECRET_NAME,
        nextCredentials.libertyUsername,
    );
    await setEnvValue(
        LIBERTY_PASSWORD_SECRET_NAME,
        nextCredentials.libertyPassword,
    );
};

export const handleGetLibertyCredentials = async (): Promise<
    EndpointData<LibertyCredentials>
> => {
    try {
        const libertyCredentials = await getLibertyCredentials();
        return {
            value: libertyCredentials,
            error: undefined,
        };
    } catch (error) {
        return {
            value: undefined,
            error: error instanceof Error ? error.message : String(error),
        };
    }
};

export const handleSaveLibertyCredentials = async (
    _: IpcMainInvokeEvent,
    nextCredentials: LibertyCredentials,
): Promise<string | undefined> => {
    try {
        setLibertyCredentials(nextCredentials);
    } catch (error) {
        return error instanceof Error ? error.message : String(error);
    }
};

export const saveTopHatStorageState = async (): Promise<void> => {
    const { libertyUsername, libertyPassword } = await getLibertyCredentials();
    if (!libertyUsername || !libertyPassword) {
        console.log("Failed to retrieve Liberty credentials.");
        return;
    }

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    try {
        const page = await context.newPage();

        await page.goto("https://app.tophat.com/login");

        const schoolCombo = page.getByRole("combobox", {
            name: "Type to search for your school",
        });

        await schoolCombo.click();
        await schoolCombo.fill("Liberty University");
        await page
            .getByRole("option", {
                name: "Liberty University",
                exact: true,
            })
            .click();
        await page
            .getByRole("button", { name: "Log in with school account" })
            .click();

        const emailBox = page.getByRole("textbox", {
            name: "Enter your email, phone, or",
        });
        await emailBox.click();
        await emailBox.fill(libertyUsername);
        await page.getByRole("button", { name: "Next" }).click();

        const passwordBox = page.getByRole("textbox", {
            name: "Enter the password for",
        });
        await passwordBox.click();
        await passwordBox.fill(libertyPassword);
        await page.getByRole("button", { name: "Sign in" }).click();

        await page.waitForURL("**/e");

        const storageState = await context.storageState();
        saveStorageState(storageState);
    } catch (error) {
        console.log(error instanceof Error ? error.message : String(error));
    } finally {
        await context.close();
        await browser.close();
    }
};

export const refreshTopHatAuthKey = async (): Promise<void> => {
    let thAuthKey: string | null = null;

    const browser = await chromium.launch({ headless: false });

    let storageState;
    try {
        storageState = await loadStorageState();
    } catch {
        await browser.close();
        console.log("Fatal: could not load authenticated storage state.");
    }

    const context = await browser.newContext({ storageState: storageState });
    const page = await context.newPage();

    try {
        const jwtRequestPromise = page.waitForRequest((request: Request) =>
            request.url().includes("refresh_jwt"),
        );

        await page.goto("https://app.tophat.com/e");
        await page.getByRole("button", { name: "Main Menu" }).click();

        const jwtRequest = await jwtRequestPromise;
        const postData = jwtRequest.postData();
        if (!postData) {
            throw new Error("No post data");
        }

        const parsed = JSON.parse(postData);
        thAuthKey = parsed[AUTH_REQUEST_KEY_NAME];
    } catch (error) {
        console.log(error instanceof Error ? error.message : String(error));
    } finally {
        await context.close();
        await browser.close();
    }

    if (!thAuthKey) {
        console.log("Fatal: Could not retrieve Top Hat auth key.");
    }

    await setEnvValue(AUTH_KEY_SECRET_NAME, thAuthKey);
};

const getAuthTokenForSession = async (): Promise<string> => {
    const jwtUrl = "https://app.tophat.com/identity/v1/refresh_jwt/";
    const jwtData = {
        th_jwt_refresh: await getEnvValue(AUTH_KEY_SECRET_NAME),
    };

    const response = await fetch(jwtUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(jwtData),
    });

    if (response.status !== 201) {
        throw new Error("Unable to obtain JWT token");
    }

    const json = await response.json();
    const jwtToken = json["th_jwt"];

    return jwtToken;
};

export const callEndpoint = async <E>(
    endpoint: string,
    fallback?: E,
): Promise<EndpointData<E | undefined>> => {
    try {
        const apiToken = await getAuthTokenForSession();
        const url = `https://app.tophat.com/api/${endpoint}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        });

        if (!response.ok) {
            return {
                value: fallback,
                error: `Top Hat error: ${response.status} ${response.statusText}`,
            };
        }

        const nextData = await response.json();

        return {
            value: nextData,
        };
    } catch (error) {
        return {
            value: fallback,
            error: `Runtime error: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
};
