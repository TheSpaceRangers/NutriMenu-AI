import React, { useState } from 'react'

import { ZodError } from "zod"

import { FormSelect, FormInput, FormButton } from './Forms'

import  { paramsSchema } from '../schemas/generate_menu'
import type { Params } from '../schemas/generate_menu'

import { generateMenu } from '../services/nutrimenu-api.tsx'

export default function GenerateMenu() {
    const [form, setForm] = useState({
        days: 1,
        people: 2,
        diet: "Tous les régimes",
        start_date: new Date().toISOString().slice(0, 10),
    });

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null)
        setLoading(true);

        let params: Params;

        try {
            params = paramsSchema.parse(form);
        } catch (e: unknown) {
            if (e instanceof ZodError)
                setError(e.issues.map(err => err.message).join("\n"));
            else
                setError("Erreur de validation du formulaire");
            setLoading(false);
            return;
        }

        try {
            const response = await generateMenu(params);
            console.log(response);
        } catch (e: unknown) {
            if (e instanceof Error)
                setError("Une erreur est survenue lors de la génération du menu. Veuillez réessayer => " + e.message);
            else
                setError("Une erreur inattendue est survenue lors de la génération du menu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white rounded-xl p-10 shadow mb-12">
            <form onSubmit={handleSubmit}>
                <fieldset className="grid grid-cols-2 gap-2 border-none mb-8 p-0">
                    <FormSelect
                        id='days'
                        name='days'
                        label='📅 Nombre de jours'
                        options={[
                            { value: 1, label: '1 jour' },
                            { value: 2, label: '2 jours' },
                            { value: 3, label: '3 jours' },
                            { value: 7, label: '7 jours' },
                        ]}
                        value={form.days}
                        onChange={handleChange}
                    />

                    <FormInput 
                        id='people'
                        name='people'
                        label='Nombre de personnes'
                        type='number'
                        value={form.people}
                        onChange={handleChange}
                        placeholder="Nombre de personnes"
                        required
                        min='1'
                        max='12'
                    />

                    <FormSelect
                        id='diet'
                        name='diet'
                        label='Régime alimentaire'
                        options={[
                            { value: 'Tous les régimes', label: 'Tous les régimes' },
                            { value: 'Végétarien', label: 'Végétarien' },
                            { value: 'Végétalien', label: 'Végétalien' },
                            { value: 'Sans gluten', label: 'Sans gluten' },
                            { value: 'Cétogène', label: 'Cétogène' },
                        ]}
                        value={form.diet}
                        onChange={handleChange}
                    />

                    <FormInput
                        id='start_date'
                        name='start_date'
                        label='Date de début'
                        type='date'
                        value={form.start_date}
                        onChange={handleChange}
                        placeholder="Date de début"
                        required
                    />
                </fieldset>

                <FormButton
                    icon='⚡'
                    type="submit"
                    loading={loading}
                    loading_msg='Génération en cours...'
                    loading_icon='⏳'
                    disabled={loading}
                >
                    Générer mon menu
                </FormButton>
            </form>

            {error && (
                <div className="mt-4 bg-red-100 text-red-800 px-4 py-3 rounded border border-red-200">
                    {error}
                </div>
            )}
        </section>
    )
}
