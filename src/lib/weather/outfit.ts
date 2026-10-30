import type { Units } from "./types";

export interface OutfitAdvice {
  headline: string;
  tips: string[];
}

interface OutfitInput {
  feelsLike: number;
  windSpeed: number;
  conditionId: number;
  isDay: boolean;
  units: Units;
}

export function getOutfitAdvice({
  feelsLike,
  windSpeed,
  conditionId,
  isDay,
  units,
}: OutfitInput): OutfitAdvice {
  // نحوّل لمئوي ومتر/ثانية، فالعتبات واحدة بغض النظر عن وحدات العرض
  const celsius = units === "imperial" ? ((feelsLike - 32) * 5) / 9 : feelsLike;
  const wind = units === "imperial" ? windSpeed * 0.44704 : windSpeed;

  let headline: string;
  const tips: string[] = [];

  if (celsius <= 0) {
    headline = "Bundle up";
    tips.push("Heavy winter coat", "Hat, gloves and a scarf");
  } else if (celsius <= 8) {
    headline = "Cold";
    tips.push("Warm coat", "Sweater or fleece underneath");
  } else if (celsius <= 15) {
    headline = "Cool";
    tips.push("Light jacket or hoodie", "Long pants");
  } else if (celsius <= 22) {
    headline = "Mild";
    tips.push("Long sleeves or a light layer");
  } else if (celsius <= 29) {
    headline = "Warm";
    tips.push("T-shirt and light pants or shorts");
  } else {
    headline = "Hot";
    tips.push("Light, breathable clothes", "Drink plenty of water");
  }

  const wet =
    (conditionId >= 200 && conditionId < 400) ||
    (conditionId >= 500 && conditionId < 600);
  if (wet) tips.push("Umbrella or a waterproof jacket");
  if (conditionId >= 600 && conditionId < 700)
    tips.push("Waterproof boots with good grip");
  if (wind >= 8) tips.push("A windproof outer layer");
  if (isDay && celsius >= 24 && (conditionId === 800 || conditionId === 801)) {
    tips.push("Sunglasses and sunscreen");
  }
  if (conditionId >= 700 && conditionId < 800) {
    tips.push("Take extra care outdoors: visibility may be low");
  }

  return { headline, tips };
}
