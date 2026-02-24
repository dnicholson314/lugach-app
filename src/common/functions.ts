export const formatDate = (date: Date): string => {
    return `${date.getUTCMonth()}/${date.getUTCDate()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
};
