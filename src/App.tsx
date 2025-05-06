import { useCallback, useEffect, useState } from "react";
import words from "./worldList.json";
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";

function getNewWord() {
	return words[Math.floor(Math.random() * words.length)];
}
function App() {
	const [guessWord, setGuessWord] = useState(getNewWord);
	const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

	const incorrectLetters = guessedLetters.filter(
		(letter) => !guessWord.includes(letter)
	);

	const isLoser = incorrectLetters.length >= 6;
	const isWinner = guessWord
		.split("")
		.every((letter) => guessedLetters.includes(letter));

	const addGuessedLetter = useCallback(
		(letter: string) => {
			if (guessedLetters.includes(letter) || isWinner || isLoser) return;

			setGuessedLetters((currentLetters) => [...currentLetters, letter]);
		},
		[guessedLetters, isWinner, isLoser]
	);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key;

			if (!key.match(/^[a-z]$/)) return;

			e.preventDefault();
			addGuessedLetter(key);
		};

		document.addEventListener("keypress", handler);

		return () => {
			document.removeEventListener("keypress", handler);
		};
	}, [guessedLetters]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key;

			if (key !== "Enter") return;

			e.preventDefault();
			setGuessedLetters([]);
			setGuessWord(getNewWord());
		};

		document.addEventListener("keypress", handler);

		return () => {
			document.removeEventListener("keypress", handler);
		};
	}, []);

	return (
		<div
			style={{
				maxWidth: "800px",
				display: "flex",
				flexDirection: "column",
				gap: "2rem",
				margin: "0 auto",
				alignItems: "center",
			}}
		>
			<div
				style={{
					fontSize: "2rem",
					textAlign: "center",
				}}
			>
				{isWinner && "Winner! - Refresh to try again!"}
				{isLoser && "Nice Try! - Refresh to try again!"}
			</div>
			<HangmanDrawing numberOfGuesses={incorrectLetters.length} />
			<HangmanWord
				reveal={isLoser}
				guessedLetters={guessedLetters}
				guessWord={guessWord}
			/>
			<div style={{ alignSelf: "stretch" }}>
				<Keyboard
					disabled={isWinner || isLoser}
					activeLetters={guessedLetters.filter((letter) =>
						guessWord.includes(letter)
					)}
					inactiveLetters={incorrectLetters}
					addGuessedLetter={addGuessedLetter}
				/>
			</div>
		</div>
	);
}

export default App;
