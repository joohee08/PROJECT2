
class quizpop extends Phaser.Scene {
    constructor() {
        super("quizpop");
    }

    preload() {
        // GitHub Pages에서의 repository-name을 설정
		 this.load.setBaseURL('/PROJECT2');
         
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.audio('quizpopbgm', '/audio/quizpopbgm.mp3'); // 퀴즈팝 BGM
        this.load.audio('correct', '/audio/correct.mp3'); // 정답
        this.load.audio('wrong', '/audio/wrong.mp3'); // 오답
        this.load.audio('bell', '/audio/bell.mp3'); // 시간초과
    }

    create() {

        // game 씬의 BGM을 일시 정지하고, quizpop BGM을 바로 재생
        const gameScene = this.scene.get('Game');
        if (gameScene.bgm && gameScene.bgm.isPlaying) {
            gameScene.bgm.pause();
        }

        this.quizBgm = this.sound.add('quizpopbgm', { loop: true, volume: 0.5 });
        this.quizBgm.play();

        WebFont.load({
            google: {
                families: ['Nanum Gothic']
            },
            active: () => {
                this.createQuestion();
            }
        });

        const quizbackground = this.add.image(639, 357, "quizbackground");
        quizbackground.scaleX = 2.1;
        quizbackground.scaleY = 2.1;

        const x = this.add.image(1202, 93, "x");
        x.setScale(0.1);
        x.setInteractive();
        x.on('pointerdown', () => {
            this.closeQuiz(gameScene);
        });

         // bell.png 이미지를 동그라미 위치에 표시
        const bellIcon = this.add.image(660, 95, 'clock');
        bellIcon.setScale(0.1); // 크기 조정 필요시 설정

        this.resultText = null;  // 정답/오답 텍스트 변수 초기화

		// 타이머 텍스트 추가 및 초기화
        this.timerText = this.add.text(730, 97, "5", { // 타이머 텍스트 추가
            fontFamily: 'Nanum Gothic',
            fontSize: '70px',
			fontweight: 'bold',
            fill: '#ff0000'
        }).setOrigin(0.5);
        
        this.timeLeft = 5; // 초기 제한 시간 설정
    }

    closeQuiz(gameScene) {
        // 퀴즈팝 BGM 정지 및 게임 BGM 재개
        if (this.quizBgm) {
            this.quizBgm.stop();
        }
        
        // quizpop 씬이 닫힐 때 game BGM 이어서 재생
        if (gameScene.bgm && gameScene.bgm.isPaused) {
            gameScene.bgm.resume();
        }
        
        // 생명 변화 없이 퀴즈 씬 종료 후 게임 씬 재개
        gameScene.resetQuizFlag(); // 퀴즈 활성화 플래그 초기화
        this.scene.stop('quizpop');
        this.scene.resume('Game');
    }

    createQuestion() {
        this.questions = [
            {
                question: "한국의 수도는?",
                answers: [
                    { text: "서울", isCorrect: true },
                    { text: "부산", isCorrect: false },
                    { text: "대구", isCorrect: false }
                ]
            },
            {
                question: "2 + 2는?",
                answers: [
                    { text: "4", isCorrect: true },
                    { text: "3", isCorrect: false },
                    { text: "5", isCorrect: false }
                ]
            },
            {
                question: "지구는 몇 번째 행성인가요?",
                answers: [
                    { text: "3번째", isCorrect: true },
                    { text: "2번째", isCorrect: false },
                    { text: "4번째", isCorrect: false }
                ]
            }
        ];

        this.createRandomQuestion();
    }

    createRandomQuestion() {
        const randomQuestionIndex = Phaser.Math.Between(0, this.questions.length - 1);
        const selectedQuestion = this.questions[randomQuestionIndex];

        const questionText = this.add.text(700, 230, selectedQuestion.question, {
            fontFamily: 'Nanum Gothic',
            fontSize: '70px',
            fontWeight: 'bold',
            fill: '#000'
        }).setOrigin(0.5);

        const answerOptions = Phaser.Utils.Array.Shuffle(selectedQuestion.answers);

        for (let i = 0; i < answerOptions.length; i++) {
            const option = answerOptions[i];
            const answerButton = this.add.text(450 + i * 200, 450, option.text, {
                fontFamily: 'Nanum Gothic',
                fontSize: '30px',
                fill: '#000',
                backgroundColor: '#FFCC00',
                padding: { left: 10, right: 10, top: 5, bottom: 5 }
            })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.checkAnswer(option.isCorrect));

            answerButton.setDisplaySize(150, 60);
        }

		// 5초 제한시간 타이머 추가
        this.timerEvent = this.time.addEvent({
            delay: 1000, // 1초마다 호출
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

	updateTimer() {
        this.timeLeft--; // 남은 시간 감소
        this.timerText.setText(this.timeLeft.toString()); // 타이머 텍스트 업데이트
    
        if (this.timeLeft <= 1) {
            this.timerEvent.remove(); // 타이머 종료
    
            // 시간 초과 이미지 표시
            const timeoutImage = this.add.image(700, 350, 'hands'); // hands.png 이미지 표시
            this.sound.play('bell'); // 시간초과

             // 생명 감소 처리
             const gameScene = this.scene.get('Game');
             gameScene.loseLife();
    
            // 1초 후에 이미지와 퀴즈 종료
            this.time.delayedCall(1000, () => {
                timeoutImage.destroy(); // 이미지 제거
                this.closeQuiz(this.scene.get('Game')); // quizpop 씬 종료 및 게임 씬으로 복귀
            });
        }
    }

    checkAnswer(isCorrect) {
		const gameScene = this.scene.get('Game');
	
		// 타이머 이벤트 정지
		if (this.timerEvent) {
			this.timerEvent.remove();
		}
	
        // 정답 또는 오답 이미지 설정
        let resultImage;
		if (isCorrect) {
            this.sound.play('correct'); // 정답 효과음 재생
			gameScene.gainLife();
            resultImage = this.add.image(700, 350, 'true'); // 정답 이미지 표시
		} else {
            this.sound.play('wrong'); // 오답 효과음 재생
			gameScene.loseLife();
            resultImage = this.add.image(700, 350, 'false'); // 오답 이미지 표시
		}
	
		this.time.delayedCall(1000, () => {
            this.closeQuiz(gameScene);
		});
	}
 }
