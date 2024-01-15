const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const PokerEvaluator =  require('poker-evaluator');
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

var rooms = {};



// 텍사스 홀덤 게임 로직 클래스
class TexasHoldemGame {
  constructor(roomId) {
    this.roomId = roomId;
    this.players = [];
    this.deck = [];
    this.communityCards = [];
    this.currentRound = 0;
    this.currentTurn = -1; // 딜러 버튼을 바탕으로 한 턴 관리 (-1: 딜러 버튼을 아직 선택하지 않음)
    this.pot = 0; // 판에 모인 금액
    this.dealer = -1;
    this.Sb = 200;
    this.Bb = 400;

  }

  initializeGame() {
    //게임 초기화가 안되는중...... 
    console.log("initial");
    this.deck = this.generateDeck();
    this.shuffleDeck(this.deck);
    this.communityCards = [];
    this.currentTurn = -1;
    this.currentRound = 0;
    this.pot = 600;
    this.dealer += 1;
    this.Sb = 200;
    this.Bb = 400;
    
    console.log("딜러버튼",this.dealer)
    console.log("1");

    while (this.dealer >= this.players.length){
      this.dealer -= this.players.length;
    }
    this.currentTurn = this.dealer + 2;
    
    console.log("2");

    for (const player of this.players) {
      player.hand = [];
      player.folded = false;
      player.inRound = true;
      player.action = false;
      player.bet = 0;
    }
    console.log("3");

    for (let i = this.dealer;i<(this.players.length + this.dealer);i++){
      let j = i;
      while(j>=this.players.length){
        j -= this.players.length;
      }
      if (j === 1){
        this.players[j].bet = this.Sb;
        this.players[j].stack -= this.Sb;
      }
      if (this.players.length === 2){
        if(j===0){
          this.players[j].bet = this.Bb;
          this.players[j].stack -= this.Bb;
        }
      }else{
        if (j === 2){
          this.players[j].bet = this.Bb;
          this.players[j].stack -= this.Bb;
        }
      }
      
    }

  }

  // 카드 덱 생성
  generateDeck() {
    // const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    // const suits = ['♠', '♣', '♥', '♦'];
    const deck = ["Ac", "2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "Tc", "Jc", "Qc", "Kc", "Ad", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "Td", "Jd", "Qd", "Kd", "Ah", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "Th", "Jh", "Qh", "Kh", "As", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "Ts", "Js", "Qs", "Ks"];

    // for (const suit of suits) {
    //   for (const rank of ranks) {
    //     deck.push(rank + suit);
    //   }
    // }

    return deck;
  }

  // 카드 덱 섞기
  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  // 카드 나눠주기
  dealCards() {
    for (const player of this.players) {
      player.hand = [this.deck.pop(), this.deck.pop()];
    }
  }

  startGame() {
    console.log("start new")
    this.initializeGame();
    this.dealCards();
    const data={
      "players":this.players,
      "communityCards":this.communityCards,
      "pot":this.pot,
    }
    console.log(data);
    io.to(this.roomId).emit('gameStart',data)
    this.nextTurn(); // 딜러 버튼을 선택한 다음 턴부터 시작
  }

  nextRound(){
    if (this.currentRound === 3){
      this.endRound();
      return
    }
    this.currentRound ++ ;
    for (const player of this.players){
      player.bet = 0;
    }
    this.currentTurn = this.dealer;

    if(this.currentRound === 1){
      this.communityCards.push(this.deck.pop());
      this.communityCards.push(this.deck.pop());
      this.communityCards.push(this.deck.pop());
    }else{
      this.communityCards.push(this.deck.pop());
    }
    const data={
      "players":this.players,
      "communityCards":this.communityCards,
      "pot":this.pot,
      "round":this.currentRound,
    }
    this.getRemainingPlayers().forEach((p)=>{
      p.action = false;
    })
    io.to(this.roomId).emit('nextRound',data)
    this.nextTurn(); 
  }



  nextTurn() {
    this.currentTurn++;
    if (this.currentTurn >= this.players.length){
      while(this.currentTurn >= this.players.length){
        this.currentTurn -= this.players.length;
      }
    }

    // 모든 플레이어가 폴드한 경우 라운드 종료
    if (this.getRemainingPlayers().length === 1) {
      // this.endRound();
      console.log("All fold");
      return;
    }
    let M = -1;
    let temp = 0
    let canCheck = false;
    for (const player of this.players) {
      if (player.bet > M){
        M = player.bet;
      }
    }
    
    this.getRemainingPlayers().forEach((p)=>{
      if(p.action === true){
        temp ++;
      }
    })
    if (temp === this.getRemainingPlayers().length){
      console.log("하이")
      this.nextRound();
      return;
    }


    const currentPlayer = this.players[this.currentTurn];
    if (currentPlayer.folded || !currentPlayer.inRound) {
      // 폴드한 플레이어 또는 해당 라운드에서 이미 나간 플레이어는 다음 턴으로 넘어감
      this.nextTurn();
    } else {
      
      
      if (currentPlayer.bet === M){
        canCheck = true;
      }
      
      const data = {
        "socketId":currentPlayer.socketId,
        "canCheck":canCheck,
      }
      console.log("currentTurn에 보낸데이터",data)
      io.to(this.roomId).emit('currentTurn', data);
    }
  }
  
  call(playerId) {
    const player = this.getPlayerById(playerId);
    const remainingPlayers = this.getRemainingPlayers();

    if (player && remainingPlayers.includes(player)) {
      
      let M = -1;
      for (const p of this.players) {
        if (p.bet > M){
          M = p.bet;
        }
      }
      console.log("M",M)
      this.pot += (M-player.bet);
      player.stack -= (M-player.bet);
      player.bet = M;
      player.action = true;


      //남은 플레이어들에게 베팅 액션 알림
      io.to(this.roomId).emit('betMade', {
        "players":this.players,
        "pot":this.pot,
      });

      this.nextTurn();
        // 다음 턴으로 넘어가기
       
    }
  }

  // 체크하기
  check(playerId) {
    const player = this.getPlayerById(playerId);
    const remainingPlayers = this.getRemainingPlayers();

    if (player && remainingPlayers.includes(player)) {
      player.action = true;
      this.nextTurn();
    }
  }

  // 폴드하기
  fold(playerId) {
    const player = this.getPlayerById(playerId);
    const remainingPlayers = this.getRemainingPlayers();

    if (player && remainingPlayers.includes(player)) {
      player.folded = true;
      player.action = true;
      // 해당 플레이어가 폴드했음을 알림
      // io.to(this.roomId).emit('playerFolded', playerId);
      // 다음 턴으로 넘어가기
      this.nextTurn();
    }
  }

  // 레이즈하기
  raise(playerId, raiseAmount) {
    const player = this.getPlayerById(playerId);
    const remainingPlayers = this.getRemainingPlayers();
    

    if (player && remainingPlayers.includes(player)) {
      
      this.pot += (parseInt(raiseAmount)-player.bet);
      player.stack -= (parseInt(raiseAmount)-player.bet);
      console.log("player stack",player.stack)
      player.bet = parseInt(raiseAmount);
      
      remainingPlayers.forEach((p)=>{
        p.action = false;
      })
      player.action = true;


      //남은 플레이어들에게 베팅 액션 알림
      io.to(this.roomId).emit('betMade', {
        "players":this.players,
        "pot":this.pot,
      });

      this.nextTurn();
        // 다음 턴으로 넘어가기
    }
  }

  // 라운드 종료
  endRound() {
    // 게임 결과 계산, 승자 결정 등의 로직 구현 
    let winner = [];
    let max_value = -1;
    this.players.forEach((p)=>{
      let x = PokerEvaluator.evalHand([...this.communityCards,...p.hand]);
      if(x.value > max_value){
        winner = [];
        winner.push(p);
        max_value = x.value;
      }else if (x.value === max_value){
        winner.push(p);
      }
    })

    winner.forEach((p)=>{
      const player = this.players.find(element=>element===p);
      player.stack += this.pot/parseInt(winner.length);
    })

    console.log(winner)
    console.log(this.players)
    // 게임 결과를 클라이언트에게 전송
    const data = {
      'winner':winner,
      'players':this.players,
    }
    io.to(this.roomId).emit('gameResult', data);
    console.log("여기용")
    // 다음 게임을 준비
    
  }

  // 플레이어 ID로 플레이어 찾기
  getPlayerById(playerId) {
    return this.players.find(player => player.socketId === playerId);
  }

  // 남은 플레이어들 반환
  getRemainingPlayers() {
    return this.players.filter(player => player.inRound && !player.folded);
  }
}










io.on('connection',(socket)=>{

  socket.on('createRoom',(response)=>{
    
    console.log(response)
    const roomId = uuidv4();
    
    const game = new TexasHoldemGame(roomId);
    game.players.push(response)
    rooms[roomId] = game;
    
    console.log(`방${roomId}이 생성되었습니다.`)
    socket.emit('roomCreated', roomId);
  })



  socket.on('firstJoin',(res)=>{
    
    console.log("rooms > ",rooms)
    const roomId = res.roomId;
    socket.join(roomId);
    
    if (roomId in rooms) {
      if (rooms[roomId].players[0].socketId === undefined){
        rooms[roomId].players[0]["socketId"] = res.socketId;
      }
      
      const data = rooms[roomId].players
      socket.emit('firstJoined',data)
      console.log(rooms[roomId].players)
    } else {
      // 해당 Room ID가 존재하지 않는 경우
      io.to(roomId).emit('roomNotFound');
    }
    
  })



  socket.on('joinRoom', (playerInfo) => {
    const roomId = playerInfo.roomId;
    socket.join(roomId)
    console.log(socket.id+"가"+playerInfo.roomId+"에 조인되었습니다")

    if (roomId in rooms) {
      // 해당 Room ID의 players 배열에 현재 소켓을 추가
      
      rooms[roomId].players.push(playerInfo)
      console.log(rooms[roomId].players)

      // 방의 플레이어들에게 새로운 플레이어가 참가했음을 알림
      io.to(roomId).emit('newPlayer',rooms[roomId].players);
    } else {
      // 해당 Room ID가 존재하지 않는 경우
      io.to(roomId).emit('roomNotFound');
    }
  });


  socket.on('start-game',(roomId)=>{
    game = rooms[roomId]
    game.startGame();
  })

  socket.on('action',(res)=>{
    game = rooms[res.roomId]
    console.log(rooms[res.roomId].players);
    if (res.action === "check"){
      game.check(res.socketId)
    }else if (res.action === "call"){
      game.call(res.socketId)
    }else if (res.action === "fold"){
      game.fold(res.socketId)
    }else if (res.action === "bet"){
      game.raise(res.socketId,res.betAmount);
    }
  })

  


  socket.on('disconnect', () => {
    // 플레이어가 방에서 나갔을 때 처리
    
    // rooms 객체를 순회하며 플레이어를 제거하고 방에 남은 플레이어가 없다면 해당 방도 제거
    // for (const roomId in rooms) {
    //   const room = rooms[roomId];
    //   const playerIndex = room.players.indexOf(socket);
    //   if (playerIndex !== -1) {
    //     room.players.splice(playerIndex, 1);
    //     if (room.players.length === 0) {
    //       delete rooms[roomId];
    //     } else {
    //       // 방의 플레이어들에게 플레이어가 나갔음을 알림
    //       socket.to(roomId).emit('playerLeft', socket.id);
    //     }
    //     break;
    //   }
    // }
  });
})










app.get('/startgame', (req, res) => {
  // const roomId = generateRoomId();
  res.send("Hello");
});

app.post('/createRoom',(req,res)=>{
  console.log(req.body)
})



server.listen(8080, () => {
  console.log('서버가 http://localhost:8080/ 에서 실행 중입니다.');
});

