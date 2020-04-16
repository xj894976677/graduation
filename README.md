# 亚当 :guardsman:
## 简介 :page_facing_up:
此工程拟开发一款类微博APP。实现用户地图，发表信息，漫游信息，好友聊天等社交软件基本功能。以提供给更多的学习者  
技术方面前端选用uniapp，以便多端兼容，后端使用Java ssm框架。整体前后端分离。  
## 目前功能:unlock:
### 个人模块:man:
用户注册、用户密码登录、用户邮箱验证码登录、修改邮箱、通过邮箱重置密码、修改个人信息、关注取关用户。
### 浏览信息模块:eyes:
用户首次进入此app或者小程序时，会推荐热门消息。如果登录之后即可浏览关注用户发表过的微博。推荐热门消息也会根据个人的喜好进行更改。  
此处实现下拉刷新以及分页功能，但是有缺陷，下拉时只可以下拉最上方的蓝色导航条。  
### 好友消息模块:two_men_holding_hands:
使用腾讯IM功能，目前支持接受任何人消息，以及给关注用户发送消息  
此功能感谢DCloud插件市场 cometang丶作者提供的tim插件。  
tim插件GitHub链接：https://github.com/cometang/tim-uniapp.git  
tim插件DCloud插件市场链接：https://ext.dcloud.net.cn/plugin?id=1421  
### 发表信息模块:memo:
在我的界面点击发微博即可发送微博，此处内容包含文字，类型，定位，图片。  
## 如何使用:round_pushpin:
因正处于开发中，暂不提供安卓或ios安装包。
## 如何运行:car:
前端需下载Hbuilder软件，直接打开snp-uniapp文件夹运行即可。此处可运行到微信小程序或者安卓模拟器当中，也可选择真机运行。详情参考uniapp官方文档  
uniapp官方文档：[https://uniapp.dcloud.io/](https://uniapp.dcloud.io/)  
后端可使用IDEA打开ssm-snp文件下的pom.xml文件，使用Maven自动下载需要的jar包，使用tomcat运行即可。  
此处说明开发时可用的环境 IDEA 2018.3.6 x64，HbuilderX 2.5.1，Mysql5.7。  
如项目无法启动，请尝试检查Project Structure中Artifacts。如WEB-INF下并无lib目录，请创建目录并添加Maven中说明到的jar包。  
开发工具优先选择以上说明的，以避免一些问题。  
## 其他说明:warning:
此工程正处于开发中，如有更好的想法功能:bulb:，或者一些问题:question:可以及时联系:postbox:，以完善此工程。  
## 已知缺陷:warning:
微博下拉刷新只能下拉最上方蓝色导航条----------------正在修改  

## 联系我 :love_letter:
个人公众号：猫也想编程  
个人微信：xiangjun19980311(注明来意)
