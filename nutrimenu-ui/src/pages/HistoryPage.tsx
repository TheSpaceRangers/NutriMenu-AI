import { useCallback, useEffect, useState } from "react";

import { addMonths, format, subMonths } from "date-fns";

import { fetchMenus } from "../services/nutrimenu-api.tsx";

import Calendar from "../components/Calendar.tsx";

import type { MenusSlimByMonth } from "../types/menu.tsx";

export default function HistoryPage() {
    const [menusByMonth, setMenusByMonth] = useState<MenusSlimByMonth>({});
    const [loading, setLoading] = useState(false);

    const loadMenus = useCallback(async (months: string[]) => {
        setLoading(true);
        try {
            const response = await fetchMenus(months);
            setMenusByMonth(response);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const months = [
            format(subMonths(new Date(), 1), "yyyy-MM"),
            format(new Date(), "yyyy-MM"),
            format(addMonths(new Date(), 1), "yyyy-MM"),
        ];
        void loadMenus(months);
    }, [loadMenus]);

    const handleMonthChange = (month: string) => {
        void loadMenus([month, format(addMonths(new Date(month + "-01"), 1), "yyyy-MM")]);
    };

    return (
        <Calendar
            menus={menusByMonth}
            currentMonth={format(new Date(), "yyyy-MM")}
            onMonthChange={handleMonthChange}
            loading={loading}
        />
    )
}
