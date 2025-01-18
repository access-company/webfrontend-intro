---
title: '第6章　リストとkey'
---

ここでは、React コンポーネントのリストの実装の仕方について学びます。

その前に、JavaScript でリスト（配列）を変換する方法のおさらいをします。

リストの変換は、`Array`（配列）の `map` 関数（[MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map)）を使います。たとえば、`numbers`という配列を受け取って中身の値を 2 倍にするコードは以下の通りです。

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num: number) => num * 2);

console.log(doubled); // [2, 4, 6, 8, 10]
```

React でも、配列を「**React 要素のリスト**」に変換することで応用ができます。

次のコードを例に、リストと key の用法を説明していきます。

```typescript
type ListItemProps = {
  value: number;
};

type NumberListProps = {
  numbers: Array<number>;
};

const ListItem: FC<ListItemProps> = (props) => <li>{props.value}</li>;

const NumberList: FC<NumberListProps> = (props) => {
  const { numbers } = props;
  return (
    <ul>
      {numbers.map((num: number) => (
        <ListItem key={num.toString()} value={num} />
      ))}
    </ul>
  );
};
```

```bash
# react/exercise にて
$ TARGET=C06/Sample1 npm run dev
```

### 【課題 6-1】

以下のような出力となるように変更してください

- item 2
- item 4
- item 6
- item 8
- item 10

```bash
# react/exercise にて
$ TARGET=C06/Q1 npm run dev
```

編集対象ファイル: `react/exercise/C06/Q1/index.tsx`

## React のリストのルール

どの React 要素が変更、追加もしくは削除されたかを認識するために`key`属性を必ず与える必要があります。また、`key`属性の値は、一意の値である必要があります。

**【注意事項】** 配列の item の値を `key`属性の値とした場合、リストの値に重複があると描画の不具合を起こします。

// どのような不具合が起こるのかを説明するか、公式Docへの参照URLを書いておいた方がよいと思います。[key によるリストアイテムの順序の保持 
](https://ja.react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)

```javascript
[1, 2, 2, 3, 4, 2];
```

データの中にユニークな識別子`id`がある場合は、その識別子を`key`属性の値として使ってください。

```javascript
[
  { id: '0001', number: 1 },
  { id: '0002', number: 2 },
  { id: '0003', number: 2 },
  { id: '0004', number: 3 },
  { id: '0005', number: 4 },
  { id: '0006', number: 2 },
];
```
