const container = document.querySelector('.container')
const canvas = document.querySelector('#canvas1')

let fillUpload = document.querySelector('#fileUpload')

//for allowing canvas to take full wisth and height
canvas.width = window.innerWidth 
canvas.height = window.innerHeight 

let audio = document.querySelector('#audio1');

const ctx = canvas.getContext('2d');
let audioSource;
let analyzer;

container.addEventListener('click',()=>{
 
    

audio.src = ('assets/songJack-sparrow.mp3')
let audioCtx = new AudioContext();  //audio webApi of JS like CAnvas

    audio.play();

    audioSource = audioCtx.createMediaElementSource(audio);
    analyzer = audioCtx.createAnalyser();
    audioSource.connect(analyzer);
    analyzer.connect(audioCtx.destination)

    analyzer.fftSize = 64 ;//handle the hard lines of frequency

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 5;
    let barHeight;
    let x ;
     
    function animate(){
        x=0;
        
        ctx.clearRect(0,0,canvas.width,canvas.height)
        analyzer.getByteFrequencyData(dataArray);

        drawVisualizer(bufferLength,barHeight,barWidth,x,dataArray);
       
        requestAnimationFrame(animate);
    }
   animate()
})


fillUpload.addEventListener('change',function(){
  
    console.log(this.files)
    const file = this.files;
    audio.src = URL.createObjectURL(file[0]);
    audio.load();

    audio.play()
    audioSource = audioCtx.createMediaElementSource(audio);
    analyzer = audioCtx.createAnalyser();
    audioSource.connect(analyzer);
    analyzer.connect(audioCtx.destination)
    analyzer.fftSize = 1024

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 5
    let barHeight;
    let x ;
     
    function animate(){
        x=0;
        
        ctx.clearRect(0,0,canvas.width,canvas.height)
        analyzer.getByteFrequencyData(dataArray);

        drawVisualizer(bufferLength,barHeight,barWidth,x,dataArray);

        requestAnimationFrame(animate);
    }
   animate()

})

//for showing visualizer
function drawVisualizer(bufferLength,barHeight,barWidth,x,dataArray){
    for(let i=0;i<bufferLength;i++){
        barHeight = dataArray[i] ;
        
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(i + Math.PI * 2 / bufferLength);

        const red = dataArray[i] * 2;
        const green = barHeight/2;
        const blue = i*4;

        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,2,5);

        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(0,0,barWidth,barHeight);
        x += barWidth

        ctx.restore()
    }
   
}