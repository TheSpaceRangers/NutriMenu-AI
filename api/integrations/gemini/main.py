import base64

from os import getenv
from json import loads
from datetime import date

from google import genai
from google.genai import types

from schemas import Menus


def generate(
    number_of_days: int,
    number_of_people: int,
    diet: str,
    start_date: str = date.today().isoformat()
) -> Menus:
    client = genai.Client(
        api_key=getenv("GEMINI_API_KEY"),
    )

    model = "gemini-2.0-flash-lite"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""
                    Contexte : 
                        Tu es un agent expert en nutrition, spécialisé dans la création automatique de menus alimentaires pour des groupes, en respectant les recommandations nutritionnelles officielles et les contraintes personnalisées de l’utilisateur.
                        
                    Objectif :
                        - Générer des menus complets (déjeuner et dîner uniquement) pour un nombre de jours et de personnes donnés.
                        - Ta réponse doit être exclusivement au format JSON structuré, sans texte additionnel, et doit inclure :
                            1. Les menus détaillés par jour avec, pour chaque repas :
                                - Le nom du plat
                                - Les ingrédients (avec quantités calculées pour le nombre de personnes)
                                - Les apports nutritionnels estimés (calories, protéines, glucides, lipides, fibres)
                            2. Un récapitulatif total des ingrédients nécessaires sur la période et pour toutes les personnes
                            3. Une liste de courses synthétique, adaptée à la quantité totale d’ingrédients
                            4. Les menus doivent commencer à la date passé en paramètre (YYYY-MM-DD)
                        
                    Contraintes à respecter :
                        - Tu proposes uniquement un déjeuner et un dîner par jour
                        - Les menus sont variés d’un jour à l’autre
                        - Les apports nutritionnels de chaque journée doivent respecter les recommandations moyennes pour un adulte (exemple : 2000 kcal, 50g de protéines, etc.)
                        - Les quantités sont automatiquement ajustées selon les paramètres fournis
                    
                    Paramètres reçus :
                        - number_of_days (integer)
                        - number_of_people (integer)
                        - diet (string)
                        - start_date (string)
                        
                    Règles importantes :
                        - La réponse doit toujours être uniquement du JSON, pas de texte explicatif
                        - Toutes les quantités et apports sont adaptés selon les paramètres utilisateur
                        - Les menus doivent être réalistes, équilibrés et variés
                        - Si un ingrédient revient plusieurs fois, additionne la quantité pour la liste d’achats
                        - Si un régime alimentaire spécifique est précisé, adapte tous les menus en conséquence
                        
                    Exemple d'appel utilisateur :
                        - nombre_de_jours: 3
                        - nombre_de_personnes: 2
                        - régime: végétarien (optionnel)
                """),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text=(
                        f"number_of_days: {number_of_days}\n"
                        f"number_of_people: {number_of_people}\n"
                        f"diet: {diet}\n"
                        f"start_date: {start_date}"
                    )
                ),
            ],
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        safety_settings=[
            types.SafetySetting(
                category="HARM_CATEGORY_HARASSMENT",
                threshold="BLOCK_LOW_AND_ABOVE",  # Block most
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_HATE_SPEECH",
                threshold="BLOCK_LOW_AND_ABOVE",  # Block most
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold="BLOCK_LOW_AND_ABOVE",  # Block most
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold="BLOCK_LOW_AND_ABOVE",  # Block most
            ),
        ],

        response_mime_type="application/json",

        response_schema=genai.types.Schema(
            type = genai.types.Type.OBJECT,
            properties = {
                "menus": genai.types.Schema(
                    type = genai.types.Type.ARRAY,
                    items = genai.types.Schema(
                        type = genai.types.Type.OBJECT,
                        required = ["diet"],
                        properties = {
                            "date": genai.types.Schema(
                                type = genai.types.Type.STRING,
                                format = "date-time",
                            ),
                            "lunch": genai.types.Schema(
                                type = genai.types.Type.OBJECT,
                                properties = {
                                    "name": genai.types.Schema(
                                        type = genai.types.Type.STRING,
                                    ),
                                    "ingredients": genai.types.Schema(
                                        type = genai.types.Type.ARRAY,
                                        items = genai.types.Schema(
                                            type = genai.types.Type.OBJECT,
                                            properties = {
                                                "name": genai.types.Schema(
                                                    type = genai.types.Type.STRING,
                                                ),
                                                "quantity": genai.types.Schema(
                                                    type = genai.types.Type.STRING,
                                                ),
                                            },
                                        ),
                                    ),
                                },
                            ),
                            "diner": genai.types.Schema(
                                type = genai.types.Type.OBJECT,
                                properties = {
                                    "name": genai.types.Schema(
                                        type = genai.types.Type.STRING,
                                    ),
                                    "ingredients": genai.types.Schema(
                                        type = genai.types.Type.ARRAY,
                                        items = genai.types.Schema(
                                            type = genai.types.Type.OBJECT,
                                            properties = {
                                                "name": genai.types.Schema(
                                                    type = genai.types.Type.STRING,
                                                ),
                                                "quantity": genai.types.Schema(
                                                    type = genai.types.Type.STRING,
                                                ),
                                            },
                                        ),
                                    ),
                                },
                            ),
                            "diet": genai.types.Schema(
                                type = genai.types.Type.STRING,
                            ),
                        },
                    ),
                ),
            },
        ),
    )

    result = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        result += chunk.text

    try:
        data = loads(result)
        return Menus.parse_obj(data)
    except Exception as e:
        raise

