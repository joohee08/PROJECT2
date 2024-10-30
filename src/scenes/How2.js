class How2 extends Phaser.Scene {

	constructor() {
		super("How2");
	}

	preload() {
		// GitHub Pages에서의 repository-name을 설정
		this.load.setBaseURL('/PROJECT2');
		
		this.load.audio('ting', '/audio/ting.mp3'); //NEXT버튼 클릭
	}

	editorCreate() {

		// 배경 색상 추가
		const rectangle_1 = this.add.rectangle(638, 358, 1280, 720, 0xffffe0); // 부드러운 노란색 배경

		// 아이템들 추가
		const moyappi = this.add.image(98, 184, "moyappi").setScale(0.35);
		const suzy = this.add.image(208, 185, "suzy").setScale(0.35);
		const action = this.add.image(308, 187, "action").setScale(0.25);
		const yuridoll = this.add.image(415, 191, "yuridoll").setScale(0.25);
		const rock = this.add.image(520, 196, "rock").setScale(0.25);
		const itemText = this.add.text(830, 290, "+5", { fontSize: '36px', color: '#000000', fontFamily: 'Arial' }).setOrigin(0.5);

		// 초코비
		const chocobi = this.add.image(832, 175, "chocobi").setScale(0.25);
		const chocobiText = this.add.text(300, 300, "+1", { fontSize: '36px', color: '#000000', fontFamily: 'Arial' }).setOrigin(0.5);

		// 폭탄
		const bomb = this.add.image(195, 442, "bomb").setScale(0.3);
		const bombText = this.add.text(198, 590, "-10", { fontSize: '36px', color: '#ff0000', fontFamily: 'Arial' }).setOrigin(0.5); // 빨간색 강조

		// 피망
		const paprica = this.add.image(325, 463, "paprica").setScale(0.3);
		// 첫 번째 하트와 + 텍스트
		const heartImage1 = this.add.image(310, 592, 'heart').setScale(0.25);
		const plusText1 = this.add.text(250, 595, "+", { fontSize: '36px', color: '#000000', fontFamily: 'Arial' }).setOrigin(0.5);

		// 엄마들,휜둥이
		const chulsumom = this.add.image(604, 431, "chulsumom").setScale(0.35);
		const hunimom = this.add.image(752, 426, "hunimom").setScale(0.35);
		const jangumom = this.add.image(858, 456, "jangumom").setScale(0.35);
		const yurimom = this.add.image(1008, 425, "yurimom").setScale(0.25);
		const dog = this.add.image(1154, 452, "dog").setScale(0.45);

		// 각 엄마들 점수
		const momText = this.add.text(860, 570, "+10", { fontSize: '36px', color: '#00ff00', fontFamily: 'Arial' }).setOrigin(0.5); // 초록색 강조

		// 두 번째 하트와 + 텍스트 (다른 위치)
		const heartImage2 = this.add.image(976, 567, 'heart').setScale(0.25);
		const plusText2 = this.add.text(920, 570, "+", { fontSize: '36px', color: '#000000', fontFamily: 'Arial' }).setOrigin(0.5);

		// arrow
		const arrow = this.add.image(1200, 662, "arrow");
		arrow.scaleX = 0.35;
		arrow.scaleY = 0.5;

		this.arrowImage = arrow;

		// arrow 좌우로 움직이게 만들기
		this.tweens.add({
			targets: arrow,
			x: { from: 1150, to: 1190 }, // 1208에서 1280까지 좌우로 이동
			duration: 1000,  // 이동하는 데 걸리는 시간 (1초)
			yoyo: true,      // 다시 원래 위치로 돌아가게 설정
			repeat: -1       // 무한 반복
		});

		// 케릭터들이 둥둥 떠다니는 효과 추가
		this.addFloatingEffect([moyappi, suzy, action, yuridoll, rock, chocobi, bomb, paprica, chulsumom, hunimom, jangumom, yurimom, dog]);

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

	create() {
		this.editorCreate();

		// arrow 클릭 시 How2.js로 씬 전환
		this.arrowImage.setInteractive();
		this.arrowImage.on('pointerdown', () => {
			console.log("Arrow clicked");  // 클릭이 감지될 경우 콘솔에 표시
			this.sound.play('ting'); //NEXT버튼 클릭
			this.scene.start('How3');  
		});
	}
}