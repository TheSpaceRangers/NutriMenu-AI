import React, { useState } from "react";

import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";

import { FormButton } from "./Forms.tsx";

import type { Menu } from "../types/menu.ts";

const _capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

type _CalendarHeaderProps = {
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
};

function _CalendarHeader({ currentMonth, setCurrentMonth }: _CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-4">
            <FormButton
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
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
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                center={false}
                size="sm"
                aria-label="Mois suivant"
            >›
            </FormButton>
        </div>
    );
}

type _CalendarDaysHeaderProps = {
    currentMonth: Date;
};

function _CalendarDaysHeader({ currentMonth }: _CalendarDaysHeaderProps) {
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

type _MenuCell = {
    lunch?: string;
    dinner?: string;
};

type _CalendarCellsProps = {
    currentMonth: Date;
    menusByDate: Record<string, _MenuCell>;
};

function _CalendarCells({ currentMonth, menusByDate }: _CalendarCellsProps) {
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

type _Props = {
    menus: Menu[];
};

export default function Calendar({ menus }: _Props) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const menusByDate = React.useMemo(() => {
        const map: Record<string, Menu> = {};
        for (const menu of menus) {
            map[menu.date] = menu;
        }
        return map;
    }, [menus]);

    return (
        <section className="bg-white rounded-xl shadow p-6">
            <_CalendarHeader currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
            <_CalendarDaysHeader currentMonth={currentMonth} />
            <_CalendarCells currentMonth={currentMonth} menusByDate={menusByDate} />
        </section>
    );
}
