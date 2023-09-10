enum units {
    year = 24 * 60 * 60 * 1000 * 365,
    month = (24 * 60 * 60 * 1000 * 365) / 12,
    day = 24 * 60 * 60 * 1000,
    hour = 60 * 60 * 1000,
    minute = 60 * 1000,
    second = 1000,
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const getRelativeTime = (d1: Date, d2 = new Date()) => {
    const elapsed = d1.getTime() - d2.getTime();

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (const u in units) {
        const unit = u as keyof typeof units;
        if (Math.abs(elapsed) > units[unit] || u == "second")
            return rtf.format(Math.round(elapsed / units[unit]), unit);
    }
};

export default getRelativeTime;