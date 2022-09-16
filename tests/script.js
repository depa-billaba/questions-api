import http from 'k6/http';
import { sleep } from 'k6';


export default function () {
  const product = Math.floor(Math.random() * 1000000);
  http.get(`http://localhost:8090/qa/questions?product_id=${product}`);
}