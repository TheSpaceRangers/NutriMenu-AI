import { useEffect, useState } from 'react'

import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormButton from './FormButton'

import { generateMenu } from '../services/api'

type Ingredient = {
  name: string;
  quantity: string;
};

type Menu = {
  date: string;
  lunch: {
    name: string;
    ingredients: Ingredient[];
  };
  diner: {
    name: string;
    ingredients: Ingredient[];
  };
  diet: string;
};

type Data = {
  menus: Menu[];
};

export default function MenuForm() {
    const [days, setDays] = useState(1)
    const [people, setPeople] = useState(2)
    const [diet, setDiet] = useState('Aucune restriction')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<Data | null>(null)
    const [error, setError] = useState<string | null>(null);
    
    const handleDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDays(Number(e.target.value))
    }
    
    const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPeople(Number(e.target.value))
    }

    const handleDietChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDiet(e.target.value)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null)
        setLoading(true);
        try {
            const response = await generateMenu({ days, people, diet });
            setData(response);
        } catch (error: any) {
            setError("Une erreur est survenue lors de la génération du menu. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white rounded-xl p-10 shadow mb-12">
            <form onSubmit={handleSubmit}>
                <fieldset className="grid grid-cols-3 gap-3 border-none mb-8 p-0">
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
                        value={days}
                        onChange={handleDaysChange}
                    />

                    <FormInput 
                        id='people'
                        name='people'
                        label='Nombre de personnes'
                        type='number'
                        value={people}
                        onChange={handlePeopleChange}
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
                            { value: 'Aucune restriction', label: 'Aucune restriction' },
                            { value: 'Végétarien', label: 'Végétarien' },
                            { value: 'Végétalien', label: 'Végétalien' },
                            { value: 'Sans gluten', label: 'Sans gluten' },
                            { value: 'Cétogène', label: 'Cétogène' },
                        ]}
                        value={diet}
                        onChange={handleDietChange}
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
