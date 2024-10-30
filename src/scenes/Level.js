// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// jang
		const jang = this.add.image(643, 359, "jang");
		jang.scaleX = 1.04;
		jang.scaleY = 0.9;

		// title
		const title = this.add.image(613, 135, "title");
		title.scaleX = 1.0;
		title.scaleY = 1.0;
		
		this.titleImage = title;  // title 이미지를 this.titleImage로 참조

		 // moss
		 this.moss = this.add.image(268, 320, "moss");  // this.moss로 참조 설정
		 this.moss.scaleX = 0.35;
		 this.moss.scaleY = 0.35;
		 this.moss.angle = 61;

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();

		 // 게임 중 BGM이 재생 중일 경우 멈춤
		 const gameScene = this.scene.get('Game');
		 if (gameScene && gameScene.bgm && gameScene.bgm.isPlaying) {
			 gameScene.bgm.stop(); // Game BGM 멈춤
		 }
	 
		 // title BGM을 재생 - 기존 BGM 인스턴스가 있다면 삭제하고 새로 추가
		 if (this.sound.get('jangtitlebgm')) {
			 this.sound.remove(this.sound.get('jangtitlebgm')); // 기존 title BGM 삭제
		 }
	 
		 this.bgm = this.sound.add('jangtitlebgm', { loop: true, volume: 0.5 });
		 this.bgm.play();
		
		// title.png 깜빡이는 효과 추가
		this.time.addEvent({
			delay: 500,  // 500ms마다
			callback: () => {
				this.titleImage.visible = !this.titleImage.visible;  // visible 속성을 토글
			},
			loop: true
		});

		 // moss 이미지 대각선 애니메이션 추가
		 this.tweens.add({
			targets: this.moss,  // 움직일 대상
			x: this.moss.x + 20,  // 오른쪽 대각선으로 이동
			y: this.moss.y - 20,  // 위쪽으로 이동
			duration: 1000,       // 애니메이션 지속 시간 (1초)
			yoyo: true,           // 애니메이션 반대로 재생 (왔다갔다)
			repeat: -1            // 무한 반복
		});

		// title 클릭 시 How1.js로 씬 전환
		this.titleImage.setInteractive();
		this.titleImage.on('pointerdown', () => {
			this.sound.play('ting'); //타이틀 클릭
			this.scene.start('How1');  // How1 씬으로 전환
		});
	}
}
		
		
/* END-USER-CODE */


/* END OF COMPILED CODE */

// You can write more code here
