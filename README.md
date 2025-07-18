# ジオメトリウォーズ風 ツインスティックシューティング

これは、ウェブブラウザで動作する、レトロなネオンスタイルのツインスティックシューティングゲームです。

https://github.com/user-attachments/assets/08fea48d-b359-4ad8-a759-584c63d98214

## 概要

プレイヤーは自機を操作し、四方から迫りくる敵をショットで破壊していきます。敵を倒してスコアを稼ぎ、ハイスコア更新を目指します。3回敵に衝突するとゲームオーバーです。

## ✨ 主な機能

* **ツインスティック操作**: キーボードとゲームパッドの両方で、移動と射撃を独立して操作できます。
* **残機制**: 3機のライフがあり、すべて失うとゲームオーバーになります。
* **スコアとハイスコア**: ゲームのスコアが記録され、ハイスコアはブラウザの`localStorage`に保存されます。
* **ゲームプレイの激化**: スコアが上がるにつれて、敵の出現頻度が増加し、難易度が上昇します。
* **派手なビジュアルエフェクト**:
    * ネオンスタイルのグラフィックと残像効果
    * 敵や自機の爆発時のパーティクルエフェクト
    * 被弾時の画面シェイク
    * 復活後の一定時間の無敵（点滅）
* **レスポンシブデザイン**: ゲーム画面はブラウザウィンドウのサイズに合わせて自動的に調整されます。

## 🎮 操作方法

ゲームの開始とリスタートは、`ENTER`キーまたはゲームパッドのボタンで行います。

### キーボード

| 操作              | キー                  |
| :---------------- | :-------------------- |
| **移動** | `W` `A` `S` `D`       |
| **射撃** | `↑` `↓` `←` `→` (矢印キー) |
| **開始/リスタート** | `ENTER`               |

### ゲームパッド

| 操作              | コントローラー入力                         |
| :---------------- | :----------------------------------------- |
| **移動** | 左スティック                               |
| **射撃** | 右スティック                               |
| **開始/リスタート** | `START` ボタンまたは `A` ボタン (一般的な配置) |

### ライセンス

MIT ライセンスで公開しています。
