// drawRect.js
export const drawRect = (detections, ctx) => {
  detections.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const text = `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`;

    // Set random color for each bounding box
    const color = Math.floor(Math.random() * 16777215).toString(16);
    ctx.strokeStyle = '#' + color;
    ctx.font = '18px Arial';

    // Draw rectangles and text
    ctx.beginPath();
    ctx.fillStyle = '#' + color;
    ctx.fillText(text, x, y > 10 ? y - 5 : 10); // Position text above box
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
};
