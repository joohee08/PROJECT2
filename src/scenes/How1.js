// You can write more code here

/* START OF COMPILED CODE */

class How1 extends Phaser.Scene {

	constructor() {
		super("How1");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	preload() {
		this.load.audio('ting', '/audio/ting.mp3'); //NEXT버튼 클릭
	}

	/** @returns {void} */
	editorCreate() {

		// rectangle_1
		const rectangle_1 = this.add.rectangle(634, 357, 128, 128);
		rectangle_1.scaleX = 10.07;
		rectangle_1.scaleY = 5.57;
		rectangle_1.isFilled = true;
		rectangle_1.fillColor = 14674565;

		// howto
		const howto = this.add.image(298, 181, "howto");
		howto.scaleX = 0.35;
		howto.scaleY = 0.35;

		// howto_2
		const howto_2 = this.add.image(298, 520, "howto-2");
		howto_2.scaleX = 0.35;
		howto_2.scaleY = 0.35;

		// keycur
		const keycur = this.add.image(741, 136, "keycur");
		keycur.scaleX = 0.35;
		keycur.scaleY = 0.4;

		// keycur 깜빡이게 만들기
		 this.tweens.add({
            targets: keycur,
            alpha: { from: 1, to: 0 }, // 투명도 변화로 깜빡임 효과
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

		// text_2 (방향키)
		const text_2 = this.add.text(624, 257, "방향키 오른쪽 왼쪽 이동", {
            fontSize: "30px",
            color: "#000000",
            fontFamily: "Arial"
        });
        text_2.setScale(1.5);

		// text_3 (점프)
        const text_3 = this.add.text(878, 402, "점프", {
            fontSize: "30px",
            color: "#000000",
            fontFamily: "Arial"
        });
        text_3.setScale(1.5);

		// text_4 (설명 문구)
		const text_4 = this.add.text(603, 487, "랜덤으로 떨어지는 아이템을 획득하여 제한시간안에 점수를 얻는다.\n캐릭터별로 피해야할 아이템이 있다.\n피하지 못할 경우 -10점과 함께 생명이 날아간다.\n생명을 얻을수있는 기회=엄마를 잡아라!!!", {
            fontSize: "22px",
            color: "#000000",
            fontFamily: "Arial"
        });
        text_4.setLineSpacing(10); // 줄 간격 추가

		// spacebar
		const spacebar = this.add.image(741, 418, "spacebar");
		spacebar.scaleX = 0.3;
		spacebar.scaleY = 0.3;

		// spacebar 깜빡이게 만들기
		this.tweens.add({
            targets: spacebar,
            alpha: { from: 1, to: 0 }, // 투명도 변화로 깜빡임 효과
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

		// arrow
		const arrow = this.add.image(0, 667, "arrow");
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
		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();

		// arrow 클릭 시 How2.js로 씬 전환
		this.arrowImage.setInteractive();
		this.arrowImage.on('pointerdown', () => {
			this.sound.play('ting'); //NEXT버튼 클릭
			this.scene.start('How2');  // How2 씬으로 전환
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

