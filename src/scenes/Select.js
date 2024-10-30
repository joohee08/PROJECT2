class Select extends Phaser.Scene {

	constructor() {
		super("Select");

		// 캐릭터 변수를 클래스의 속성으로 선언
		this.selectedCharacter = null;
		this.charac2 = null;
		this.charac3 = null;
		this.charac1 = null;
		this.charac4 = null;
		this.charac5 = null;
	}

	preload() {
		// GitHub Pages에서의 repository-name을 설정
		this.load.setBaseURL('/PROJECT2'); //로컬 서버에서 실행하고싶으면 이부분을 모두 주석처리하면 됩니다
		
		this.load.audio('selecthover', '/audio/selecthover.mp3'); //케릭터 선택 효과음
		this.load.audio('jangreac', '/audio/jangreac.mp3'); //짱구 선택 효과음
		this.load.audio('chulreac', '/audio/chulreac.mp3'); //철수 선택 효과음
		this.load.audio('hunreac', '/audio/hunreac.mp3'); //훈이 선택 효과음
		this.load.audio('yurireac', '/audio/yurireac.mp3'); //유리 선택 효과음
		this.load.audio('mengreac', '/audio/mengreac.mp3'); //맹구 선택 효과음
	}

	/** @returns {void} */
	editorCreate() {
		// background
		const background = this.add.video(639, 355, "background");
		background.scaleX = 0.67;
		background.scaleY = 0.67;
		background.play(true);

		// 각 캐릭터를 this를 통해 클래스 속성으로 설정
		this.charac2 = this.add.image(190, 475, "charac2").setInteractive();
		this.charac2.scaleX = 0.26;
		this.charac2.scaleY = 0.26;

		this.charac3 = this.add.image(416, 492, "charac3").setInteractive();
		this.charac3.scaleX = 0.36;
		this.charac3.scaleY = 0.36;

		this.charac1 = this.add.image(635, 483, "charac1").setInteractive();
		this.charac1.scaleX = 0.4;
		this.charac1.scaleY = 0.4;

		this.charac4 = this.add.image(844, 482, "charac4").setInteractive();
		this.charac4.scaleX = 0.4;
		this.charac4.scaleY = 0.4;

		this.charac5 = this.add.image(1081, 482, "charac5").setInteractive();
		this.charac5.scaleX = 0.25;
		this.charac5.scaleY = 0.25;

		// 캐릭터 클릭 시 이벤트 처리
		this.charac2.on('pointerdown', () => this.selectCharacter('철수'));
		this.charac3.on('pointerdown', () => this.selectCharacter('훈이'));
		this.charac1.on('pointerdown', () => this.selectCharacter('짱구'));
		this.charac4.on('pointerdown', () => this.selectCharacter('유리'));
		this.charac5.on('pointerdown', () => this.selectCharacter('맹구'));
	}

	selectCharacter(characterName) {
		this.selectedCharacter = characterName;
	
		// 선택된 캐릭터에 맞는 효과음 재생 (볼륨을 1.5로 설정)
		switch (characterName) {
			case '철수':
				this.sound.play('chulreac', { volume: 3 });
				break;
			case '훈이':
				this.sound.play('hunreac', { volume: 3 });
				break;
			case '짱구':
				this.sound.play('jangreac', { volume: 3 });
				break;
			case '유리':
				this.sound.play('yurireac', { volume: 3 });
				break;
			case '맹구':
				this.sound.play('mengreac', { volume: 3 });
				break;
		}

		// 게임 씬으로 이동하며 선택된 캐릭터 정보를 전달
		this.scene.start('Game', { selectedCharacter: characterName });
	}
	

	create() {
		this.editorCreate();

		 // select 이미지
		 const selectImage = this.add.image(650, 200, 'choose');
		 selectImage.setScale(0.3); 

		// hover 효과
		const hoverEffect = (character) => {
			character.on('pointerover', () => {
				character.setTint(0xcccccc);  // 이미지에 회색 필터를 적용 (hover 효과)
				this.sound.play('selecthover'); // 캐릭터 위에 마우스를 올릴 때마다 효과음 재생
			});
			character.on('pointerout', () => {
				character.clearTint();  // hover 효과 제거
			});
		};

		// 각 캐릭터에 hover 효과 적용
		hoverEffect(this.charac2);
		hoverEffect(this.charac3);
		hoverEffect(this.charac1);
		hoverEffect(this.charac4);
		hoverEffect(this.charac5);
	}
}