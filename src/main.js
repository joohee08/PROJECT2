

window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1280,
		height: 720,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			orientation: Phaser.Scale.LANDSCAPE,
		},
		 physics: {
            default: 'arcade',  // 물리 엔진 사용
            arcade: {
                gravity: { y: 300 },  // 중력 설정 (필요에 따라 변경)
                debug: false
            }
        }
    });


	game.scene.add("Boot", Boot, true);
	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("How1", How1);
	game.scene.add("How2", How2);
	game.scene.add("How3", How3);
	game.scene.add('Select', Select);  // Select 씬 등록
    game.scene.add('Game', Game);
	game.scene.add('quizpop', quizpop);  
 	game.scene.add("End", End);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {

		this.scene.start("Preload");
	}
}