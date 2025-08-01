import { useState, useMemo } from "react";

import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";

import { FormButton } from "./Forms.tsx";

import type { MenusSlimByMonth } from "../types/menu.tsx";

const _capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

type _CalendarHeaderProps = {
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
    onMonthChange: (month: string) => void;
};

function _CalendarHeader({ currentMonth, setCurrentMonth, onMonthChange }: _CalendarHeaderProps) {
    const handlePrev = () => {
        const newMonth = subMonths(currentMonth, 1);
        setCurrentMonth(newMonth);
        onMonthChange(format(newMonth, "yyyy-MM"));
    }

    const handleNext = () => {
        const newMonth = addMonths(currentMonth, 1);
        setCurrentMonth(newMonth);
        onMonthChange(format(newMonth, "yyyy-MM"));
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <FormButton
                type="button"
                onClick={handlePrev}
                center={false}
                size="sm"
                aria-label="Mois précédent"
            >‹
            </FormButton>
            <span className="font-semibold text-lg">
                {_capitalizeFirstLetter(format(currentMonth, "MMMM yyyy"))}
            </span>
            <FormButton
                type="button"
                onClick={handleNext}
                center={false}
                size="sm"
                aria-label="Mois suivant"
            >›
            </FormButton>
        </div>
    );
}

function _CalendarDaysHeader({ currentMonth }: { currentMonth: Date }) {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    return (
        <div className="grid grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
                <div
                    key={i}
                    className="text-xs sm:text-sm text-gray-500 text-center font-medium py-2"
                >
                    {format(addDays(startDate, i), "EEE").slice(0, 3)}
                </div>
            ))}
        </div>
    );
}

function _CalendarCells({
    currentMonth,
    menusByDate
}: {
    currentMonth: Date;
    menusByDate: Record<string, { lunch?: string; dinner?: string }>;
}) {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            const dateStr = format(day, "yyyy-MM-dd");
            const menu = menusByDate[dateStr];

            days.push(
                <div
                    key={dateStr}
                    className={`
                        p-2 min-h-[80px] border text-sm relative cursor-pointer
                        ${!isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-300" : "bg-white"}
                        ${isSameDay(day, new Date()) ? "border-blue-500" : ""}
                    `}
                >
                    <div className="font-semibold mb-1">{format(day, "d")}</div>
                    {menu && (
                        <div className="space-y-1">
                            {menu.lunch && (
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="block w-2 h-2 rounded-full bg-rose-400"></span>
                                    <span>{menu.lunch}</span>
                                </div>
                            )}
                            {menu.dinner && (
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="block w-2 h-2 rounded-full bg-blue-400"></span>
                                    <span>{menu.dinner}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="grid grid-cols-7" key={format(day, "yyyy-MM-dd")}>
                {days}
            </div>
        );
        days = [];
    }
    return <div>{rows}</div>;
}

export default function Calendar({
    menus,
    currentMonth: currentMonthStr,
    onMonthChange,
    loading = false,
}: {
    menus: MenusSlimByMonth;
    currentMonth: string;
    onMonthChange: (month: string) => void;
    loading?: boolean;
}) {
    const [monthState, setMonthState] = useState(
        new Date(currentMonthStr + '-01')
    );

    const menusByDate = useMemo(() => {
        const map: Record<string, { lunch: string | undefined; dinner: string | undefined }> = {};
        for (const monthKey of Object.keys(menus)) {
            for (const menu of menus[monthKey]) {
                map[
                    format(new Date(menu.date), "yyyy-MM-dd")
                ] = {
                    lunch: menu.lunch,
                    dinner: menu.dinner
                }
            }
        }
        return map;
    }, [menus]);

    return (
        <section className="relative bg-white rounded-xl shadow p-6">
            {loading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                    <div className="bg-white p-4 rounded shadow">Chargement...</div>
                </div>
            )}
            <_CalendarHeader
                currentMonth={monthState}
                setCurrentMonth={setMonthState}
                onMonthChange={onMonthChange}
            />
            <_CalendarDaysHeader currentMonth={monthState} />
            <_CalendarCells currentMonth={monthState} menusByDate={menusByDate} />
        </section>
    );
}
