import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from './firebase';
import { isEqual } from 'lodash';

export default function App() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [currentSignUp, setSignUpState] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const [clueTries, setClueTries] = useState(0);
	const [penalty, setPenalty] = useState(0);
	const [wrong, setWrong] = useState(false);
	const [scavState, setScavState] = useState('onboard');
	const [prevData, setPrevData] = useState({});
	const [teamData, setTeamData] = useState({
		name: '',
		color: '',
		penalty: 0,
		progress: 0,
		try: 0
	});
	
	const Wrong = () => (
		<div id="wrong" className="incorrect">
			Incorrect. {3 - clueTries} tries left.
		</div>
	)
	
	const signUp = ['Enter your team name:','Enter your team color:']

	const questions = [
		{
			questionText: 'What is the capital of France?',
			answerOptions: [
				{ answerText: 'Paris', isCorrect: true },
			],
		},
		{
			questionText: 'What is 1+1?',
			answerOptions: [
				{ answerText: '2', isCorrect: true },
				{ answerText: 'two', isCorrect: true }
			],
		},
		{
			questionText: 'What is Peter? Answer is yes',
			answerOptions: [
				{ answerText: 'yes', isCorrect: true },
			],
		},
		{
			questionText: 'How many Harry Potter books are there?',
			answerOptions: [
				{ answerText: '7', isCorrect: true },
			],
		},
	];

	const handleAnswerButtonClick = async event => {
		event.preventDefault();

		const nextQuestion = currentQuestion + 1;
		let correct = false;
		setPrevData(teamData);
		
		switch (scavState) {
			case 'onboard':
				if (currentSignUp === 0) {
					setTeamData({
						...teamData,
						name: inputValue,
						progress: 1,
					});
					setInputValue('');
					setSignUpState(1);
				} else {
					setTeamData({
						...teamData,
						color: inputValue,
						progress: 2,
					});
					setInputValue('');
					setScavState('clues');
				}
				correct = true;
				break;
			case 'clues':
				for (let i = 0; i < questions[currentQuestion].answerOptions.length; i++) {
					if (inputValue === questions[currentQuestion].answerOptions[i].answerText) {
						setInputValue('');
						correct = true;
						if (nextQuestion < questions.length) {
							setCurrentQuestion(nextQuestion);
						}
					}
				}

				if (!correct) {
					setClueTries(clueTries + 1);
					setWrong(true);
				} else {
					setClueTries(0);
					setWrong(false);
				}

				if (clueTries === 2) {
					setInputValue('');
					setClueTries(0);
					setCurrentQuestion(nextQuestion);
					setTeamData({
						...teamData,
						penalty: penalty + 5,
					});
					setPenalty(penalty + 5);
					setWrong(false);
				}
		
				setTeamData({
					...teamData,
					progress: currentQuestion + 2,
				})
				break;
			default:
				break;
		}
	}

	useEffect(() => {
		if (teamData.progress > 1) {
			console.log(prevData,teamData)
			if (!isEqual(prevData,teamData)){
				setTeam();
				console.log('set');
			}
		}
	}, [teamData])

	useEffect(() => {
		getTeam();
	}, [teamData.name])

	useEffect(() => {
		setTeamData({
			...teamData,
			try: clueTries
		});
	}, [clueTries])


	const handleChange = event => {
		setInputValue(event.target.value);
	}

	const setTeam = async (e) => {       
        try {
			await setDoc(doc(db, "teams", teamData.name), teamData);
    	} catch (e) {
        	console.error("Error adding document: ", e);
        }
    }

	const getTeam = async (e) => {
		try {
			console.log(teamData.name);
			const docRef = doc(db, "teams", teamData.name);
			const docSnap = await getDoc(docRef);
			console.log(docSnap.data());

			if (docSnap.data() !== undefined) {
				setScavState('clues');
			}
    	} catch (e) {
        	console.error("Error reading document: ", e);
        }
	}

	return (
		<div className='app'>
			<div className='question-section'>
				<div className='question-count'>
				{
					{
						'onboard': <span>Signup!</span>,
						'clues': <span>Clue {currentQuestion + 1}/{questions.length}</span>
					}[scavState]

				}
				</div>
				<div className='question-text'>
				{
					{
						'onboard': <span>{signUp[currentSignUp]}</span>,
						'clues': <span>{questions[currentQuestion].questionText}</span>
					}[scavState]
				}
				</div>
			</div>
			<div className='answer-section'>
				<form onSubmit={handleAnswerButtonClick}>
					<input type="text" value={inputValue} onChange={handleChange} />
					<input type="submit" value={'Submit'} className = "submitBtn"/>
				</form>
				<div>
					{ wrong ? <Wrong /> : null }
				</div>
				<div>
					<span>Penalty: {penalty}</span>
				</div>
			</div>
		</div>
	);
}
