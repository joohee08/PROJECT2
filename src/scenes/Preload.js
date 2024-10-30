class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");
	}

	/** @returns {void} */
	editorPreload() {
		// 리소스 로드
		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	preload() {
		// 리소스를 먼저 로드하고 나서 씬을 전환하도록 설정
		this.editorPreload();

		// 기존 파일 로드 외에 BGM 파일 로드 추가
		this.load.audio('jangtitlebgm', '/audio/jangtitlebgm.mp3');
		this.load.audio('ting', '/audio/ting.mp3'); //타이틀 클릭

		// 리소스 로드 완료 이벤트
		this.load.on(Phaser.Loader.Events.COMPLETE, () => {
			this.editorCreate(); // 리소스 로드가 완료된 후에 editorCreate 호출
			this.scene.start("Level"); // Level 씬으로 전환
		});
	}

	/** @returns {void} */
	editorCreate() {
		// 이 시점에 scene-awake 이벤트가 발생합니다.
		this.events.emit("scene-awake");
	}
}
