---
title: '第11章　値の同一性を理解する'
---

React は、`props`と`state`が変化した時に描画を更新する仕組みを持っています。
`props`と`state`の値の変化を正しく理解するには、**値の同一性** についての理解が欠かせません。

React 内部では、値の比較に `Object.is(value1, value2)`（[参照: MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/is)） という JavaScript API を使います。

後々、React コンポーネントの実装や Hooks API を扱う上で値の同一性を意識する場面がでてきます。値の同一性は、React を理解する上でも重要なポイントです。

それでは、それぞれの型において、値の比較を行った際の挙動の違いを見ていきます。
実際に、Node コマンドまたは、ブラウザの DevTools の Console で実際に動かしてみると理解が深まることでしょう。

# Primitive Type の値の比較

## string

```javascript
> Object.is('foo', 'foo')
true

> Object.is('foo', 'bar')
false
```

## number

```javascript
> Object.is(0, 0)
true

> Object.is(0, 1)
false
```

## boolean

```javascript
> Object.is(false, false)
true

> Object.is(false, true)
false
```

## null

```javascript
> Object.is(null, null)
true
```

## undefined

```javascript
> Object.is(undefined, undefined)
true
```

# 値の比較に注意が必要な型

Primitive Type とは異なって、
Object、Array、Function は、それぞれの単純な比較で同値にならない特性をもっています。

それぞれの型の動作を確認していきます。

## Object

```javascript
> Object.is({a: 1}, {a: 1})
false
```

```javascript
> const o0 = {a: 1}
> const o1 = {a: 1}
> Object.is(o0, o1)
false

> Object.is(o0, {...o0})
false

> const o2 = o0
> Object.is(o0, o2)
true
```

## Array

```javascript
> Object.is([], [])
false

> Object.is([0, 1], [0, 1])
false
```

```javascript
> const a0 = []
> const a1 = []
> Object.is(a0, a1)
false

> const a2 = a0
> Object.is(a0, a2)
true
```

## Function

```javascript
> Object.is(() => {}, () => {})
false
```

```javascript
> const f0 = () => {}
> const f1 = () => {}
> Object.is(f0, f1)
false

> const f2 = f0
> Object.is(f0, f2)
true
```

# 値の同一性を考慮していない実装の例

下記コードは、エラー無く動作しますが、値の同一性の考慮がなされていません。

```typescript
import React, { FC, MouseEvent } from 'react';
import Avatar from './Avatar';
import DetailButton from './DetailButton';
import { doSomething } from './util';

type UserProfileProps = {
  url: string;
  name: string;
  age: number;
};

const UserProfile: FC<UserProfileProps> = (props) => {
  const { url, name, age } = props;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    doSomething(e);
  };

  return (
    <>
      <Avatar url={url} />
      <p>
        <span>Name: </span>
        <span>{name}</span>
      </p>
      <p>
        <span>Age: </span>
        <span>{age}</span>
      </p>
      <DetailButton onClick={handleClick}>Detail</DetailButton>
    </>
  );
};
```

値の同一性が考慮されていない箇所は、`handleClick`です。

```javascript
const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
  doSomething(e);
};
```

`handleClick`は関数オブジェクト（Function 型）ですが、前の説明の通り、
`UserProfile`コンポーネントが再描画されるたびに、`DetailButton`へ渡す
`handleClick`の値の同一性が失われていることに気づくことでしょう。

React では、この問題を解決する Hooks API として `useCallback` を用意しています。

# useCallback の導入

// useCallbackとReact.memoはセットで説明するのがよいと思いましたがどうでしょうか？
Reactが値の同一性を重視する理由をパフォーマンスに関連づけて説明したいです。
「第11章　値の同一性を理解する」を「第14章　描画パフォーマンスの最適化」の前の章に移動した方がよいのかなと思いました。

関数オブジェクトの値の同一性を保証するには、**関数オブジェクトをメモ化**していく必要があります。

下記のようなメモ化されていない関数オブジェクトを例にメモ化の仕方について説明します。

```javascript
const callback = (e) => {
  handleEvent(e);
  doSomething(dep1, dep2);
};
```

上記`callback`関数は、メモ化されていません。そのほか、`doSomething`関数は、`callback`関数のスコープ外にある`dep1`と`dep2`の 2 つの変数に依存していることがわかります。

`callback`関数をメモ化する場合、元の関数を`useCallback`の第 1 引数に指定して、
第 2 引数に関数内の依存変数を配列に列挙します。

```javascript
const memoizedCallback = useCallback(
  (e) => {
    handleEvent(e);
    doSomething(dep1, dep2);
  },
  [dep1, dep2]
);
```

関数内にスコープ外の依存変数が存在しないときは、第 2 引数の依存リストを空の配列としてください。

```javascript
const memoizedCallback = useCallback((e) => {
  handleEvent(e);
}, []);
```

注意事項として、`useCallback`の第 2 引数（依存リスト）は省略してはいけません。

# 値の同一性を考慮した実装の例

```typescript
import React, { useCallback, FC, MouseEvent } from 'react';
import Avatar from './Avatar';
import DetailButton from './DetailButton';
import { doSomething } from './util';

type UserProfileProps = {
  url: string;
  name: string;
  age: number;
};
const UserProfile: FC<UserProfileProps> = (props) => {
  const { url, name, age } = props;

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    console.log(e);
  }, []);

  return (
    <>
      <Avatar url={url} />
      <p>
        <span>Name: </span>
        <span>{name}</span>
      </p>
      <p>
        <span>Age: </span>
        <span>{age}</span>
      </p>
      <DetailButton onClick={handleClick}>Detail</DetailButton>
    </>
  );
};
```

# メモ化の不要の関数オブジェクト

すべての関数オブジェクトをメモ化すれば良いというわけではありません。
メモ化の不要な関数オブジェクトまで `useCallback` を使うと、それはオーバヘッドでしかありません。

ここでは、どのようなケースではメモ化が不要なのかを見ていきます。

## 関数コンポーネントのスコープ外で定義された関数

トップレベルで定義された関数は、コンポーネントが再描画されても、関数オブジェクトの値が保証されています（値が変わりません）。

```javascript
function doSomething(e) {
  // 略
}

const App: FC = () => {
  return <ChildComponent onClick={doSomething}>
}
```

## Hooks API が返す関数オブジェクト

Hooks API が返す関数オブジェクトは、値の同一性が保証されています。
Hooks API が返す関数オブジェクトとは、以下の 2 つのことを指します。

- `useState` の setter 関数
- `useReducer` の `dispatch` 関数

上記関数をさらに `useCallback` を使ってメモ化する必要はありません。

## plain な要素

plain な要素とは、HTML が定義する `div`要素、`p`要素、`span`要素、`input`要素、`a`要素などを指します。plain な要素であって、厳密にはコンポーネントではありません。

plain な要素の属性の値に対して、メモ化する必要はありません。
