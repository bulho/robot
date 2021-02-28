import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  messages = new Array;
  socket: SocketIOClient.Socket;
  commandedDirection;

  constructor() {
    this.socket = io.connect('http://192.168.0.41:3000');
    //this.socket = io.connect('http://localhost:3000');
  }

  ngOnInit() {

    this.socket.on('messageFromRobot', (data: any) => {
      console.log(data);
      this.messages.push(data);
    });

  }

  sendCommand(data: string) {

    if (data == 'forward' ||
      data == 'reverse' ||
      data == 'forward-right' ||
      data == 'forward-left' ||
      data == 'reverse-right' ||
      data == 'reverse-left' ||
      data == 'rotate' ||
      data == 'stop') {

      this.socket.emit('messageFromClient', {data: data});
      this.commandedDirection = data;

    } else {
      console.log('invalid command to robot');
      this.messages.push({msg:'Invalid command to robot', data:'Error#1'});
    }

  }


}
