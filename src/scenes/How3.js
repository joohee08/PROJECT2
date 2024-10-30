
// You can write more code here

/* START OF COMPILED CODE */

class How3 extends Phaser.Scene {

	constructor() {
		super("How3");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	preload() {
		// GitHub Pages에서의 repository-name을 설정
		this.load.setBaseURL('/PROJECT2');
		
		this.load.audio('janga', '/audio/janga.mp3'); //짱아버튼 클릭
	}

	/** @returns {void} */
	editorCreate() {

		// rectangle_1
		const rectangle_1 = this.add.rectangle(641, 362, 128, 128);
		rectangle_1.scaleX = 10.07;
		rectangle_1.scaleY = 5.57;
		rectangle_1.isFilled = true;
		rectangle_1.fillColor = 15726259;

		// quiztell
		const quiztell = this.add.image(640, 302, "quiztell");
		quiztell.scaleX = 0.6;
		quiztell.scaleY = 0.55;

		 // 제목 텍스트 (랜덤 퀴즈)
		 const text_1 = this.add.text(640, 80, "랜덤 퀴즈!", {
			fontFamily: "Nanum Gothic", // 사용할 폰트
			fontSize: "50px",
			fontStyle: "bold",
			color: "#333333", // 어두운 회색으로 텍스트 색상 변경
			align: "center",
		}).setOrigin(0.5);

		 // 정답 텍스트
		 const correctText = this.add.text(340, 530, "정답:", {
			fontFamily: "Nanum Gothic",
			fontSize: "40px",
			color: "#4CAF50" // 초록색 계열로 변경
		});

		 // 정답 추가 표시
		 const correctIcon = this.add.image(490, 555, "heart").setScale(0.2);
		 const correctPlus = this.add.text(430, 530, "+", {
			 fontFamily: "Arial",
			 fontSize: "50px",
			 color: "#4CAF50"
		 });

		 // 오답 텍스트
		 const wrongText = this.add.text(770, 530, "오답:", {
			fontFamily: "Nanum Gothic",
			fontSize: "40px",
			color: "#F44336" // 빨간색 계열로 변경
		});

		// 오답 추가 표시
		const wrongIcon = this.add.image(910, 555, "heart").setScale(0.2);
		const wrongMinus = this.add.text(860, 530, "-", {
			fontFamily: "Arial",
			fontSize: "50px",
			color: "#F44336"
		});

		 // 둥둥 떠다니는 효과를 적용할 대상 하트 배열에 추가
		 this.addFloatingEffect([correctIcon, wrongIcon]);

		 // 짱아 이미지
		 this.janga = this.add.sprite(87, 655, "janga").setScale(0.5).setInteractive(); // setInteractive로 클릭 가능하게 설정

		 // 짱아를 좌우로 이동시키는 트윈 애니메이션(clickme이미지 추가)
		 this.clickme = this.add.image(this.janga.x - 125, this.janga.y, 'clickme').setScale(0.2); // 짱아 뒤에 위치

		 this.tweens.add({
            targets: this.janga,
            x: 1200,
            duration: 4000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                // janga 위치에 따라 clickme 위치 업데이트
                this.clickme.x = this.janga.x - 125; // janga의 왼쪽에 위치
                this.clickme.y = this.janga.y; // y 좌표를 동일하게 설정
            }
        });

		// 짱아를 클릭하면 Select 씬으로 이동
			this.janga.on('pointerdown', () => {
			this.sound.play('janga'); //짱아버튼 클릭
			this.scene.start('Select'); // 'Select' 씬 시작
		});

		this.events.emit("scene-awake");
	}

	// 둥둥 떠다니는 효과 함수
	addFloatingEffect(targets) {
		targets.forEach(target => {
			this.tweens.add({
				targets: target,
				y: target.y - 10, // 상하 이동 범위
				duration: 1000, // 1초 동안 이동
				yoyo: true, // 왕복 효과
				repeat: -1, // 무한 반복
				ease: 'Sine.easeInOut' // 부드럽게 움직임
			});
		});
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	update() {
        // clickme가 janga 뒤를 따라다니도록 설정
        this.clickme.x = this.janga.x - 100;
        this.clickme.y = this.janga.y; // 짱아 이미지 위쪽에 위치하도록 조정
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
