export default class inventory {
  constructor(scene, x, y, actions) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.actions = actions;

    this.create();
  }
}
