**Detailed Explanation of DNS Lookup Process**

A **DNS (Domain Name System) lookup** is the process of translating a human-readable domain name (e.g., `ajayjb.xyz`) into an IP address (e.g., `104.21.112.1`). This allows web browsers and other applications to locate and communicate with web servers.

The lookup involves multiple DNS servers, each playing a different role. Let’s go step by step.

---

## **1. Step-by-Step Breakdown of DNS Lookup**

### **Example: You type `ajayjb.xyz` in your browser**

Your computer needs to find the **IP address** of `ajayjb.xyz` to load the website. The DNS lookup follows this process:

### **Step 1: Browser & Local Cache Check**
- The browser first **checks its cache** to see if it already has the IP address for `ajayjb.xyz`.
- If found, it directly uses the cached IP to load the website.
- If not, it asks the operating system for the IP.

### **Step 2: OS & Resolver Cache Check**
- The operating system (Windows, macOS, Linux) checks its **local DNS cache**.
- If the IP address is cached, it is returned immediately.
- If not, the OS sends the request to a **Recursive DNS Resolver** (usually from your ISP or a public DNS like Google `8.8.8.8`).

### **Step 3: Query to the Recursive DNS Resolver**
- The Recursive DNS Resolver is responsible for finding the correct IP address.
- If it has the IP cached, it returns the result immediately.
- If not, it starts a new lookup process by querying the **Root DNS Server**.

---

## **2. Query to Different Name Servers**

### **Step 4: Query to the Root DNS Server**
- The resolver asks a **Root DNS Server**:  
  _"Where can I find information about `ajayjb.xyz`?"_
- The Root DNS Server does NOT store the IP of `ajayjb.xyz`.
- It only knows which **TLD (Top-Level Domain) name server** manages `.xyz` domains.
- It replies:  
  _"Ask the `.xyz` TLD name server at `a.xyz-servers.net`."

---

### **Step 5: Query to the `.xyz` TLD Name Server**
- The resolver now queries the **TLD name server for `.xyz`**:  
  _"Where can I find the name servers for `ajayjb.xyz`?"_
- The TLD server does NOT store the IP of `ajayjb.xyz`.
- It only knows the **Authoritative Name Server** for the domain.
- It replies:  
  _"The authoritative name servers for `ajayjb.xyz` are `gabe.ns.cloudflare.com` and `kim.ns.cloudflare.com`."

---

### **Step 6: Query to the Authoritative Name Server**
- The resolver now contacts one of the **Authoritative Name Servers** (e.g., Cloudflare’s `gabe.ns.cloudflare.com` or `kim.ns.cloudflare.com`).
- It asks:  
  _"What is the IP address of `ajayjb.xyz`?"_
- The authoritative name server has the DNS records for `ajayjb.xyz`.
- It replies with the **A record (IPv4 address)**:  
  ```
  ajayjb.xyz → 104.21.112.1
  ajayjb.xyz → 104.21.96.1
  ```
  (These are Cloudflare’s IP addresses because the domain is using Cloudflare's DNS service.)

---

### **Step 7: Recursive Resolver Returns the IP**
- The Recursive Resolver now has the IP address of `ajayjb.xyz`.
- It **caches the result** to speed up future lookups.
- It then returns the IP address to your browser.

---

### **Step 8: Browser Connects to the Website**
- The browser now knows that `ajayjb.xyz` is hosted at `104.21.112.1`.
- It sends an **HTTP(S) request** to that IP.
- The web server responds, and the page loads in your browser.

---

## **3. How Subdomain DNS Lookup Works**
A subdomain (e.g., `blog.ajayjb.xyz`) follows the same recursive DNS lookup process but includes an **extra step** at the authoritative name server level.

### **Key Differences Between Domain and Subdomain Lookup**
| Feature | Root Domain (`ajayjb.xyz`) | Subdomain (`blog.ajayjb.xyz`) |
|---------|---------------------|----------------------|
| **TLD Name Server** | Handles `.xyz` domains | Same as root domain |
| **Authoritative Name Server** | Manages `ajayjb.xyz` | Also manages `blog.ajayjb.xyz` |
| **A Record Required?** | Yes | Only if pointing to a different IP |
| **Extra Lookup Step?** | No | Yes (at the authoritative server) |

---

## **4. How to Check DNS Records?**

1️⃣ **Find the IP address of a domain:**  
```sh
nslookup ajayjb.xyz
```
or  
```sh
dig ajayjb.xyz
```

2️⃣ **Check the full lookup path:**  
```sh
dig +trace ajayjb.xyz
```
This will show how the request travels through **Root → TLD → Authoritative** servers.

---

## **5. DNS Caching & Performance Optimization**

### **How to Clear DNS Cache?**

#### **Windows**  
```sh
ipconfig /flushdns
```

#### **MacOS**  
```sh
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

#### **Linux**  
```sh
sudo systemctl restart nscd
```

---

## **6. Key Takeaways**
✅ **Root DNS servers do NOT store IP addresses.** They only direct queries to TLD name servers.  
✅ **TLD name servers also do NOT store IP addresses.** They direct queries to the authoritative name server.  
✅ **Only the authoritative name server has the actual IP address** of the domain.  
✅ **DNS caching significantly speeds up lookups** by avoiding repeated queries.  

---

