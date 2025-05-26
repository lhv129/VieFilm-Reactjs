export const generateCaptcha = () => {
    const digits = new Set();

    while (digits.size < 4) {
        const randomDigit = Math.floor(Math.random() * 10); // 0 - 9
        digits.add(randomDigit);
    }

    return Array.from(digits).join('');
};