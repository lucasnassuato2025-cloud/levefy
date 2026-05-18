"use client";

import { useState } from "react";

export default function MealAIPage() {
  const [goal, setGoal] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [meal, setMeal] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateMeal() {
    try {
      setLoading(true);

      const response = await fetch("/api/ai/generate-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          weight,
          height,
          age,
          gender,
          meal,
        }),
      });

      const data = await response.json();

      setResult(data.result);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 40,
        fontFamily: "Arial",
      }}
    >
      <h1>Levefy IA Nutricional</h1>

      <input
        placeholder="Objetivo"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Peso (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Altura"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Idade"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Sexo"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Refeição"
        value={meal}
        onChange={(e) => setMeal(e.target.value)}
        style={inputStyle}
      />

      <button
        onClick={generateMeal}
        style={{
          width: "100%",
          padding: 16,
          marginTop: 20,
          border: "none",
          borderRadius: 10,
          background: "green",
          color: "#fff",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {loading ? "Gerando..." : "Gerar Dieta"}
      </button>

      <pre
        style={{
          marginTop: 30,
          background: "#f5f5f5",
          padding: 20,
          borderRadius: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {result}
      </pre>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 15,
  marginTop: 15,
  borderRadius: 10,
  border: "1px solid #ccc",
  fontSize: 16,
};