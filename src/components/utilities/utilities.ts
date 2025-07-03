
//获取两点形成的矩形里面所有的point坐标
const getRectPoints = (x0:number, y0:number, x1:number, y1:number) : Array<any> => {
  const points = [];
  const minx = Math.min(x0, x1);
  const maxx = Math.max(x0, x1);
  const miny = Math.min(y0, y1);
  const maxy = Math.max(y0, y1);
  let x;
  let y;

  for (x = minx; x <= maxx; x++){
    for (y = miny; y <= maxy; y++){
      points.push([x,y]);
    }
  }

  return points;
}

//在行/列中较短的一项发生改变时，斜角的2个额外的地块也要被判定。
//参考：https://www.bilibili.com/opus/900558138389823489
const addPoints = (points:Array<any>, isXLarger:boolean): Array<any> => {
  let x = points[0][0];
  let y = points[0][1];
  let cx;
  let cy;
  let point;
  const pointsToAdd = [];

  for (let i = 0; i < points.length; i++){
    point = points[i];

    cx = x - point[0];
    cy = y - point[1];
    x = point[0];
    y = point[1];

    //在行/列中较短的一项发生改变时，添加斜角的2个额外的地块
    if((isXLarger && cy !== 0) || (!isXLarger && cx !== 0)){
      pointsToAdd.push([x + cx, y]);
      pointsToAdd.push([x, y + cy]);
    }
  }

  return [...points, ...pointsToAdd];
}

//Bresenham直线算法
const bresenhamLine = (x0:number, y0:number, x1:number, y1:number) :Array<any> =>{
  const points = [];  // 存储路径点坐标的数组
  
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);

  //如果尝试链接的2个地块，行差或列差为1，那么整个2*x长方形范围内，所有地块都要被判定。
  if(dx <= 1 || dy <= 1){
    return getRectPoints(x0, y0, x1, y1);
  }

  const sx = (x0 < x1) ? 1 : -1;  // x方向步进（正/负）
  const sy = (y0 < y1) ? 1 : -1;  // y方向步进（正/负）

  let err = dx - dy;  // 误差项
  let [x, y] = [x0, y0];

  while (true) {
      points.push([x, y]);  // 添加当前点到路径
      
      // 到达终点时终止循环
      if (x === x1 && y === y1) break;
      
      const e2 = 2 * err;  // 当前误差的2倍
      
      // 根据误差更新坐标
      if (e2 > -dy) {
          err -= dy;
          x += sx;
      }
      if (e2 < dx) {
          err += dx;
          y += sy;
      }
  }
  
  return addPoints(points,dx - dy >= 0);
}

//将row col形式的坐标转化成x,y，方便使用
const RowColToVec2 = (param: any): Vec2 => {
  if(param.row !== undefined && param.col !== undefined){
    return {x: param.col, y: param.row};
  }else{
    return param;
  }
}


const toCamelCase = (str) => {
  return str.replace(/[-_]\w/g, match => match[1].toUpperCase());
}

export{getRectPoints, addPoints, bresenhamLine, RowColToVec2, toCamelCase}