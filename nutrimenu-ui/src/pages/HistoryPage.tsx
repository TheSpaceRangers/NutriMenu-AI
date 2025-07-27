import {useCallback, useEffect, useState} from "react";

import { addMonths, format, subMonths } from "date-fns";

import { fetchMenus } from "../services/nutrimenu-api.tsx";

import Calendar from "../components/Calendar.tsx";

import type { Menu } from "../types/menu.ts";

export default function HistoryPage() {
    const [menusByMonth, setMenusByMonth] = useState<Record<string, Menu[]>>({});
    const [loadingMonth, setLoadingMonth] = useState<string | null>(null);

    const loadMenus = useCallback(async (month: string) => {
        if (menusByMonth[month] || loadingMonth === month)
            return;
        setLoadingMonth(month);

        try {
            const response = await fetchMenus(month);
            setMenusByMonth(prev => ({
                ...prev,
                [month]: response.menus,
            }));
        } finally {
            setLoadingMonth(null);
        }
    }, [menusByMonth, loadingMonth]);

    useEffect(() => {
        Promise.all([
            loadMenus(format(subMonths(new Date(), 1), "yyyy-MM")),
            loadMenus(format(new Date(), "yyyy-MM")),
            loadMenus(format(addMonths(new Date(), 1), "yyyy-MM")),
        ]);
    }, [loadMenus]);

    return (
        <Calendar
            menus={menusByMonth[format(new Date(), "yyyy-MM")] ?? []}
        />
    )
}