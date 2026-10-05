// The weather in San Francisco for the footer scene, from Open-Meteo (free, no key).
// The answer is kept for 15 minutes, so the service is asked at most four times an hour however many people visit.
export const revalidate = 900;

const SOURCE = "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,weather_code,cloud_cover&temperature_unit=fahrenheit";

export async function GET() {
  try {
    const res = await fetch(SOURCE);
    if (!res.ok) throw new Error(String(res.status));
    const { current } = (await res.json()) as { current: { temperature_2m: number; weather_code: number; cloud_cover: number } };
    return Response.json({ code: current.weather_code, cover: current.cloud_cover, temp: Math.round(current.temperature_2m) });
  } catch {
    return Response.json({ code: null }); // the scene then follows the time of day only
  }
}
