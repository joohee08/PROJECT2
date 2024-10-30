class Game extends Phaser.Scene {
	constructor() {
		super({ key: 'Game' });
	}

	preload() {
		// GitHub Pages에서의 repository-name을 설정
		this.load.setBaseURL('/PROJECT2'); //로컬 서버에서 실행하고싶으면 이부분을 모두 주석처리하면 됩니다
		
		this.load.audio('janggamebgm', '/audio/janggamebgm.mp3'); //게임중 bgm
		this.load.audio('jump', '/audio/jump.mp3'); // 점프 소리
		this.load.audio('bomb', '/audio/bomb.mp3'); // 폭탄 소리
	}

	// Select.js에서 받은 데이터를 처리
	init(data) {
		this.selectedCharacter = data.selectedCharacter;
		this.lives = 5;  // 처음 목숨 설정
		this.heartImages = [];  // 하트 이미지 배열
	}

	editorCreate() {
		const gameWidth = this.sys.game.config.width;
		const gameHeight = this.sys.game.config.height;

		this.background = this.add.image(0, gameHeight * -0.45, "background_1").setOrigin(0, 0);

		// 무한 스크롤 배경
		this.background.setScrollFactor(0); // 배경 고정
	}

	create() {
		this.editorCreate();

		// title BGM이 재생 중이라면 멈추기
		const titleBgm = this.sound.get('jangtitlebgm');
		if (titleBgm) {
			titleBgm.stop();
		}
	
		// game BGM을 반복 재생
		this.bgm = this.sound.add('janggamebgm', { loop: true, volume: 0.5 });
		this.bgm.play();
		
		// 전달된 선택된 캐릭터 데이터를 확인
		console.log("선택된 캐릭터:", this.selectedCharacter);

		// 전달된 캐릭터에 따라 다른 이미지를 게임에 추가
		let characterImageKey;

		switch (this.selectedCharacter) {
			case '철수':
				characterImageKey = 'charac2';
				break;
			case '훈이':
				characterImageKey = 'charac3';
				break;
			case '짱구':
				characterImageKey = 'charac1';
				break;
			case '유리':
				characterImageKey = 'charac4';
				break;
			case '맹구':
				characterImageKey = 'charac5';
				break;
			default:
				characterImageKey = 'charac1';  // 기본 캐릭터
		}

		// 물리 엔진을 적용하여 캐릭터 추가
		this.player = this.physics.add.sprite(600, 70, characterImageKey).setScale(0.2);
		this.player.setCollideWorldBounds(true);  // 캐릭터가 화면 밖으로 나가지 않도록 설정
		this.player.setDepth(1);  // 캐릭터를 더 앞으로 표시

		// 중력 설정
		this.player.body.setGravityY(700);  // 중력 값을 늘려 캐릭터가 확실히 바닥에 닿도록 설정

		// 투명한 바닥을 추가
		this.ground = this.physics.add.staticGroup();
		const groundPlatform = this.ground.create(639, 670, null).setScale(50, 3.5).setAlpha(0).refreshBody();

		// 캐릭터와 바닥이 충돌하도록 설정
		this.physics.add.collider(this.player, this.ground);

		// 키보드 입력을 처리하는 객체 생성
		this.cursors = this.input.keyboard.createCursorKeys();
		this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// 이동 방향을 추적하는 변수 추가
		this.moveDirection = 0; // 0: 정지, -1: 왼쪽, 1: 오른쪽

		// 점프 소리 미리 설정
		this.jumpSound = this.sound.add('jump', { volume: 1 });

		if (!this.sys.game.device.os.desktop) {
			// 모바일 터치 조작
			this.input.on('pointerdown', (pointer) => {
				if (pointer.y < this.scale.height / 2) {
					// 상단 터치 시 점프 처리 (독립적으로 작동)
					if (this.player.body.touching.down) {
						this.player.setVelocityY(-930);
						this.jumpSound.play();  // 미리 설정된 jump 사운드 재생
					}
				} else {
					// 하단 터치 시 좌우 이동 (독립적으로 작동)
					if (pointer.x < this.scale.width / 2) {
						this.moveDirection = -1; // 왼쪽 이동
					} else {
						this.moveDirection = 1; // 오른쪽 이동
					}
				}
			});
	
			this.input.on('pointerup', (pointer) => {
				// 하단 터치 해제 시 이동 멈춤
				if (pointer.y >= this.scale.height / 2) {
					this.moveDirection = 0;
				}
			});
		}

		// 하트 이미지 설정
		this.createLivesDisplay();

		// 타이머 설정 (120초 = 2분)
		this.timeLeft = 120;
		this.timerText = this.add.text(16, 50, `Time: ${this.formatTime(this.timeLeft)}`, { fontSize: '32px', fill: '#000' });
		this.time.addEvent({
			delay: 1000,
			callback: this.updateTimer,
			callbackScope: this,
			loop: true
		});

		// 20초마다 quizpop 씬을 호출하는 타이머 이벤트 추가 (isQuizActive와 무관하게 실행)
		this.time.addEvent({
			delay: 20000, // 20초마다 퀴즈
			callback: () => {
				if (!this.isQuizActive) { // 퀴즈가 활성화되지 않았을 때만 실행
					this.isQuizActive = true;
					this.scene.pause('Game');  // Game 씬을 일시 정지
					this.scene.launch('quizpop', { score: this.score });  // QuizPop 씬 실행, 점수 전달
				}
			},
			callbackScope: this,
			loop: true // 계속 반복
		});

		// 모든 캐릭터에 공통으로 적용되는 초코비 아이템 무한 생성
		this.time.addEvent({
			delay: 1000,  // 1초마다 초코비 생성
			callback: this.spawnChocobi,
			callbackScope: this,
			loop: true
		});

		// 캐릭터별 아이템 생성
		this.spawnCharacterSpecificItems();

		// 점수 시스템
		this.score = 0;
		this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);  // 점수가 카메라에 고정되도록 설정
	}

	// 초코비를 먹었을 때 호출되는 함수
	collectChocobi(player, chocobi) {
		chocobi.disableBody(true, true);  // 초코비 과자 숨기기
		this.score += 10;
		this.scoreText.setText('Score: ' + this.score);
	}

	// 아이템별 충돌 처리 함수 (공통으로 사용)
	collectItem(player, item, scoreValue) {
		item.disableBody(true, true);  // 아이템 숨기기
		if (item.texture.key === 'bomb' || (this.selectedCharacter === '짱구' && item.texture.key === 'paprica')) {
			// 폭탄 또는 짱구가 선택되었을 때 피망을 먹으면 목숨을 잃음
			this.sound.play('bomb'); // 폭탄 효과음 재생
			this.shakeCharacter(); // 케릭터 흔들림 효과 추가
			this.loseLife();
		} else if (
			(this.selectedCharacter === '짱구' && item.texture.key === 'jangumom') ||
			(this.selectedCharacter === '철수' && item.texture.key === 'chulsumom') ||
			(this.selectedCharacter === '훈이' && item.texture.key === 'hunimom') ||
			(this.selectedCharacter === '유리' && item.texture.key === 'yurimom') ||
			(this.selectedCharacter === '맹구' && item.texture.key === 'dog')
		) {
			// 각 캐릭터의 특정 아이템을 먹으면 목숨을 추가
			this.gainLife();
		} else {
			this.score += scoreValue;  // 다른 아이템은 점수 증가
			this.scoreText.setText('Score: ' + this.score);
		}
	}

	// 캐릭터 흔들림 효과 함수
	shakeCharacter() {
		this.tweens.add({
			targets: this.player,
			x: this.player.x - 10,
			yoyo: true,
			repeat: 5,  // 흔들림 횟수
			duration: 60,  // 흔들림 속도
			onComplete: () => {
			// 흔들림이 완료되면 아무 작업도 하지 않고 그대로 유지
			}
		});
	}

	// 초코비 생성 함수
	spawnChocobi() {
		const chocobi = this.physics.add.sprite(Phaser.Math.Between(50, 800), Phaser.Math.Between(50, 300), 'chocobi');
		chocobi.setVelocityY(Phaser.Math.Between(-100, 100));  // 위아래 랜덤 속도
		chocobi.setVelocityX(Phaser.Math.Between(-50, 50));    // 좌우 랜덤 속도
		chocobi.setBounce(1, 1);  // 화면에서 튕기게 설정
		chocobi.setCollideWorldBounds(true);  // 화면 밖으로 나가지 않게 설정
		chocobi.setScale(0.1);  // 크기 설정

		this.physics.add.overlap(this.player, chocobi, (player, chocobi) => this.collectItem(player, chocobi, 10), null, this);
	}

	// 캐릭터별 아이템 생성 로직
	spawnCharacterSpecificItems() {
		switch (this.selectedCharacter) {
			case '철수':
				this.spawnItem('moyappi', 20);
				this.spawnItem('bomb', 5, 5000);  // 폭탄 아이템 생성 주기를 늘림
				this.spawnItem('chulsumom', 20, 10000);  // 철수 엄마 아이템 생성 빈도를 줄임
				break;
			case '훈이':
				this.spawnItem('suzy', 20);
				this.spawnItem('bomb', 5, 5000);  // 폭탄 아이템 생성 주기를 늘림
				this.spawnItem('hunimom', 20, 10000);  // 훈이 엄마 아이템 생성 빈도를 줄임
				break;
			case '짱구':
				this.spawnItem('action', 20);
				this.spawnItem('jangumom', 20, 10000);  // 짱구 엄마 아이템 생성 빈도를 줄임
				this.spawnItem('paprica', 20, 5000);  // 피망 아이템 생성 주기를 늘림
				break;
			case '유리':
				this.spawnItem('yuridoll', 20);
				this.spawnItem('bomb', 5, 5000);  // 폭탄 아이템 생성 주기를 늘림
				this.spawnItem('yurimom', 20, 10000);  // 유리 엄마 아이템 생성 빈도를 줄임
				break;
			case '맹구':
				this.spawnItem('rock', 20);
				this.spawnItem('bomb', 5, 5000);  // 폭탄 아이템 생성 주기를 늘림
				this.spawnItem('dog', 20, 10000);  // 흰둥이 아이템 생성 빈도를 줄임
				break;
		}
	}

	// 특정 아이템 생성 함수
	spawnItem(itemKey, scoreValue, delay = Phaser.Math.Between(3000, 5000)) {
		this.time.addEvent({
			delay: delay,  // 아이템 생성 간격을 지정할 수 있음
			callback: () => {
				const item = this.physics.add.sprite(Phaser.Math.Between(50, 800), Phaser.Math.Between(50, 300), itemKey);
				item.setVelocityY(Phaser.Math.Between(-100, 100));
				item.setVelocityX(Phaser.Math.Between(-50, 50));
				item.setBounce(1, 1);
				item.setCollideWorldBounds(true);

				// 크기 설정 (moyappi, suzy 등은 크게 설정)
				if (['moyappi', 'suzy', 'paprica', 'jangumom', 'chulsumom', 'hunimom', 'yurimom', 'dog'].includes(itemKey)) {
					item.setScale(0.2);  // 크기를 0.2로 설정
				} else {
					item.setScale(0.1);  // 기본 크기 설정
				}

				this.physics.add.overlap(this.player, item, (player, item) => this.collectItem(player, item, scoreValue), null, this);
			},
			loop: true
		});
	}

	// 목숨을 얻는 함수
	gainLife() {
		if (this.lives < 5) {  // 목숨이 최대 5개를 넘지 않도록 설정
			this.lives++;
			this.updateLivesDisplay();  // 하트 이미지 업데이트
		}
	}

	// 목숨을 잃는 함수
	loseLife() {
		this.lives--;
		this.updateLivesDisplay();  // 하트 이미지 업데이트

		// 목숨이 모두 소진되면 게임 종료
		if (this.lives <= 0) {
			this.endGame();
		}
	}

	// 퀴즈가 끝난 후 플래그를 초기화하는 함수
	resetQuizFlag() {
		this.isQuizActive = false;  // 퀴즈 활성화 상태 초기화
	}


	// 하트 이미지 생성
	createLivesDisplay() {
		for (let i = 0; i < this.lives; i++) {
			const heart = this.add.image(30 + i * 40, 120, 'heart').setScale(0.1);
			this.heartImages.push(heart);
		}
	}
	// 하트 이미지 업데이트
	updateLivesDisplay() {
		// heartImages 배열이 null 또는 undefined인 경우 빈 배열로 초기화
		this.heartImages = this.heartImages || [];
	
		// 기존 하트 이미지를 모두 삭제
		this.heartImages.forEach(heart => heart.destroy());
		this.heartImages = [];
	
		// 남은 목숨 개수만큼 하트 다시 그리기
		for (let i = 0; i < this.lives; i++) {
			const heart = this.add.image(30 + i * 40, 120, 'heart').setScale(0.1);
			this.heartImages.push(heart);
		}
	}
	

	// 게임 종료 함수
	endGame() {
		console.log('End game triggered');  // 로그 출력
		this.scene.start('End', { score: this.score });  // 점수를 함께 전달하며 End 씬으로 이동
	}

	// 타이머 업데이트 함수
	updateTimer() {
		this.timeLeft--;
		this.timerText.setText(`Time: ${this.formatTime(this.timeLeft)}`);
		if (this.timeLeft <= 0) {
			this.timeLeft = 0;
			this.endGame();  // 시간이 끝나면 게임 종료
		}
	}

	// 시간 포맷 변환 함수
	formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const partInSeconds = seconds % 60;
		const partInSecondsPadded = partInSeconds.toString().padStart(2, '0');
		return `${minutes}:${partInSecondsPadded}`;
	}

	update() {
		if (!this.sys.game.device.os.desktop) {
			// 터치 상태에 따라 이동 속도를 유지
			if (this.moveDirection === -1) {
				this.player.setVelocityX(-260); // 왼쪽 이동 유지
				this.player.flipX = true;
			} else if (this.moveDirection === 1) {
				this.player.setVelocityX(260); // 오른쪽 이동 유지
				this.player.flipX = false;
			}
		}
	
		// 데스크탑 키보드 조작 (원래 코드 유지)
		if (this.sys.game.device.os.desktop) {
			if (this.cursors.left.isDown) {
				this.player.setVelocityX(-260);
				this.player.flipX = true;
			} else if (this.cursors.right.isDown) {
				this.player.setVelocityX(260);
				this.player.flipX = false;
			} else {
				this.player.setVelocityX(0);
			}
	
			// 점프 처리와 점프 소리 재생
			if (this.cursors.space.isDown && this.player.body.touching.down) {
				this.player.setVelocityY(-930);
				this.sound.play('jump');  // 점프 사운드 재생
			}
		}
	}
}