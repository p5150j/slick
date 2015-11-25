import {ChatService} from "./chat.service";

export class ChatController {
  //public awesomeThings: ITecThing[];
  //public webDevTec: WebDevTecService;
  //public classAnimation: string;
  //public creationDate: number;
  //public toastr: any;

  public data: any[];

  /* @ngInject */
  constructor (private ChatService: ChatService, private toastr: any) {
    //this.awesomeThings = new Array();
    //this.webDevTec = webDevTec;
    //this.classAnimation = '';
    //this.creationDate = 1448411782523;
    //this.toastr = toastr;
    this.activate();
  }

  /** @ngInject */
  activate() {
    this.ChatService.getArticles().then(d => {
      this.data = d;
    });
    //this.getWebDevTec();
    //
    //var self = this;
    //
    //$timeout(function() {
    //  self.classAnimation = 'rubberBand';
    //}, 4000);
  }
  //
  //showToastr() {
  //  this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
  //  this.classAnimation = '';
  //}
  //
  //getWebDevTec() {
  //  this.awesomeThings = this.webDevTec.tec;
  //}
}
