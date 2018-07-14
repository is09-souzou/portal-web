export default (array: any[]) => array.filter((x, i, self) => self.indexOf(x) === i);
