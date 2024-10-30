class End extends Phaser.Scene {

	constructor() {
		super("End");
	}

	preload() {
		this.load.audio('ting', '/audio/ting.mp3'); //모든버튼 클릭
		this.load.audio('jangtitlebgm', '/audio/jangtitlebgm.mp3');
	}

	// 전달된 데이터를 받음 (예: score)
	init(data) {
		this.finalScore = data.score;  // 전달된 점수를 저장
	}

	editorCreate() {
		// background
		const background = this.add.video(643, 359, "background");
		background.scaleX = 0.67;
		background.scaleY = 0.67;
		background.play(true);

		// charac_end
		const charac_end = this.add.image(271, 482, "charac-end");
		charac_end.scaleX = 0.35;
		charac_end.scaleY = 0.35;

		// first_btn
		const first_btn = this.add.image(582, 525, "first-btn").setInteractive(); // 인터랙티브 설정
		first_btn.scaleX = 0.45;
		first_btn.scaleY = 0.55;

		// retry_btn
		const retry_btn = this.add.image(404, 502, "retry-btn").setInteractive(); // 인터랙티브 설정
		retry_btn.scaleX = 0.2;
		retry_btn.scaleY = 0.2;

		// next
		const next = this.add.image(566, 417, "next").setInteractive(); // 인터랙티브 설정
		next.scaleX = 0.4;
		next.scaleY = 0.35;

		this.events.emit("scene-awake");

		// 점수 표시 (전달된 점수)
		const scoreText = this.add.text(670, 200, `Score: ${this.finalScore}`, { 
			fontSize: '50px', 
			fill: 'black',
			fontStyle: 'bold'  // 글씨를 두껍게 설정
		}).setOrigin(0.6);

		// hover 효과 추가: 버튼이 커졌다가 작아짐
		this.addHoverEffect(first_btn);
		this.addHoverEffect(retry_btn);
		this.addHoverEffect(next);

		// 버튼 클릭 이벤트 처리
		first_btn.on('pointerdown', () => {
			this.sound.play('ting'); //모든버튼 클릭
			this.scene.stop('Game'); // Game 씬 종료 (BGM 정지 포함)
			this.scene.start('Level'); // 첫 화면으로 돌아감
		});

		retry_btn.on('pointerdown', () => {
			this.sound.play('ting'); //모든버튼 클릭
			const gameScene = this.scene.get('Game'); // 게임 다시 시작

			 // 기존 게임 BGM 멈춤
			 if (gameScene && gameScene.bgm && gameScene.bgm.isPlaying) {
				gameScene.bgm.stop();
			}
			 // Game 씬 다시 시작
			 this.scene.start('Game');
		});

		next.on('pointerdown', () => {
			this.sound.play('ting'); //모든버튼 클릭
			console.log('Next action clicked');
			// 여기에 다음으로 이동하는 로직 추가
		});
	}

	// hover 효과 함수
	addHoverEffect(button) {
		// 마우스를 버튼 위에 올렸을 때 (커짐 효과)
		button.on('pointerover', () => {
			button.setScale(button.scaleX * 1.1, button.scaleY * 1.1);  // 버튼을 10% 더 크게
		});

		// 마우스를 버튼 밖으로 나갔을 때 (원래 크기)
		button.on('pointerout', () => {
			button.setScale(button.scaleX / 1.1, button.scaleY / 1.1);  // 버튼을 원래 크기로
		});
	}

	create() {
		this.editorCreate();
	}
}