export const vibrate = (pattern = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

export const haptics = {
    soft: () => vibrate(10),
    medium: () => vibrate(20),
    hard: () => vibrate([50]),
    success: () => vibrate([10, 30, 10]),
    error: () => vibrate([50, 30, 50, 30, 50]),
};

export default haptics;
