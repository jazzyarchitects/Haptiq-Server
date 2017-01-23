# <img src="https://github.com/jazzyarchitects/Haptiq-Extension/blob/master/images/unauthenticated48.png" height="24" alt="Haptiq" /> Haptiq Server
Haptiq is a fingerprint based authentication system for social logins.
Today, various web browsers provide a functionality to save passwords.
But any intruders or mischievous friend who knows your laptop password can go the settings and see the saved passwords.
No security.

To solve this we made a system which enables you to login to various social sites using your Android Phone's Biometric authentication system. 
No more saving your passwords. No michiefs, No embarrassments. 
Haptiq just simplifies your login experience. Your data is kept confidential. Even we cannot see the data. 
We use AES 256-bit encryption communicating information with the chrome extension.

## Project Repositories
**Server**: https://github.com/jazzyarchitects/Haptiq-Server    
**Chrome Extension**: https://github.com/jazzyarchitects/Haptiq-Extension   
**Android**: https://github.com/code-lucidal58/Haptiq  

## Demo
[![Haptiq Demo](https://github.com/jazzyarchitects/Haptiq-Server/blob/master/gif/output_dqnjkh.gif)](https://www.youtube.com/watch?v=5-DhJmpos5s&list=PLX9oCiGE0W7-nLj4xI6TQj5q8DKs5qeq5)  
[More Videos](https://www.youtube.com/watch?v=5-DhJmpos5s&list=PLX9oCiGE0W7-nLj4xI6TQj5q8DKs5qeq5)


## Running Server

Clone the repository on your desktop PC
```shell
$ npm install
```
To install all the dependencies. Start the server using

```shell
$ sudo sysctl fs.inotify.max_user_watches=524288 
$ node server.js
```

Your server will be running on PORT 3000.

P.S. You would need to change the IP address in the Android Application and Chrome Extension to connect your phone and laptop.

##Team
Team **Phoenix**  
<table border="0">
<tr><td><img src="https://he-s3.s3.amazonaws.com/media/avatars/shreya62/resized/160/photo.jpg" height="100" alt="Shreya Mour" /></td><td>Shreya Mour <br /><a href="https://github.com/shreyamour1">@shreyamour1</a></td></tr>
<tr><td><img src="http://jibinmathews.in/img/jibin.jpg" height="100" alt="Jibin Mathews" /></td><td>Jibin Mathews <br /><a href="https://github.com/jazzyarchitect">@jazzyarchitects</a></td></tr>
<tr><td><img src="https://avatars2.githubusercontent.com/u/16690317?v=3&s=460" height="100" alt="Aanisha Mishra" /></td><td>Aanisha Mishra <br /><a href="https://github.com/code-lucidal58">@code-lucidal58</a></td></tr>
</table>

### NOTE
The actual server hosted on AWS for demo purpose has been stopped temporarily. We expect to launch again shortly.
