export const isNewUser = () => {
    return localStorage.getItem('newUser') === null;
};

export const setReturningUser = () => {
    localStorage.setItem('newUser', 'false');
};