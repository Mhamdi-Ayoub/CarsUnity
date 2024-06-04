require('dotenv').config(); // Charger les variables d'environnement
const cloudinary = require("cloudinary").v2;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
const cors = require('cors');
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const jwt_decode = require('jwt-decode');

//const { uploadToCloudinary } = require('./services/cloudinary')

app.use(cors());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb+srv://root2:root2@cluster0.rwy9wdk.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB")
}).catch((err) => {
  console.log("Error connecting to MongoDB")
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});

const List = require("./models/list");

const User = require("./models/user");
const Post = require("./models/post");
const Service = require("./models/service");
const Comenter=require('./models/comenter')
const Reclamation=require('./models/reclamation')

const Msg = require("./models/msg");
const Prestataire = require("./models/prestataire")
const Invitation = require("./models/invetation")
const Entreprise=require("./models/entreprise")
// API  to register a user in the backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, isCheckUser, profisionalemail, link, patinda, numero } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Create a new user with hashed password
    const newUser = new User({ name, email, password: hashedPassword });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    newUser.verificationCode = generateVerificationCode(6);
    newUser.admin = isCheckUser;
    // Save the user to the database
    await newUser.save();


    if (isCheckUser === "2") {
      const newEentreprise = new Entreprise({
        compte: newUser._id,
        profisionalemail,
        link,
        num: numero
      });
      await newEentreprise.save();
    }
    
    if (isCheckUser === "3") {
      const newPrestataire = new Prestataire({
        compte: newUser._id,
        email:email,
        profisionalemail,
        patinda,
        num: numero
      });
      await newPrestataire.save();
    }


    // Send the verification email to the user
    sendVerificationEmail(newUser.email, /*newUser.verificationToken,*/ newUser.verificationCode);

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

const sendVerificationEmail = async (email,/* verificationToken,*/ verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ayoub.mhamdi198@gmail.com",
      pass: "rste alnj clhi wnow",
    },
  });

  const mailOptions = {
    from: "ayoub.mhamid198@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `This is your Verification Code: ${verificationCode}.`,//coller le code ci dessous ici 
  };
  // Please click the following link to verify your email ${API_URL}verify/${verificationToken}

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email", error);
  }
};
/*
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});*/

const generateVerificationCode = (length) => {
  const chars = '1234567891';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * 10);
    code += chars[randomIndex];
  }
  return code;
};

// Définition de la variable secretKey
const secretKey = "votre_clé_secrète";

// login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    // Hash the incoming password for comparison
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (user.password !== hashedPassword) {
      return res.status(404).json({ message: "Invalid password" });
    }
    if (user.verified === false) {
      return res.status(404).json({ message: "Not verified" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ userId: user._id, token }); // Ajouter l'ID de l'utilisateur à la réponse
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});


// API de Vérification du code
app.post("/verifCode", async (req, res) => {
  try {
    const { verificationCode } = req.body;

    const user = await User.findOne({ verificationCode });
    if (!user) {
      return res.status(404).json({ message: "Invalid code" });
    }

    // Mettre à jour le champ verified de l'utilisateur à true
    user.verified = true;
    await user.save();

    res.status(200).json({ message: "Valid code", user });
  } catch (error) {
    res.status(500).json({ message: "Error verifying code" });
  }
});




/*
// API de déconnexion
app.post("/logout/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Supprimer le token du cache en utilisant l'identifiant de l'utilisateur comme clé
    client.del(userId, (err, response) => {
      if (err || !response) {
        console.log("Error deleting token from cache:", err);
        return res.status(500).json({ message: "Error logging out user" });
      }
      console.log("Token deleted from cache:", response);
      res.status(200).json({ message: "User logged out successfully" });
    });
  } catch (error) {
    console.log("Error logging out user", error);
    res.status(500).json({ message: "Error logging out user" });
  }
});

module.exports = router;
*/


app.post("/logout/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Supprimer le token du cache en utilisant l'identifiant de l'utilisateur comme clé
    client.del(userId, (err, response) => {
      if (err || !response) {
        console.log("Error deleting token from cache:", err);
        return res.status(500).json({ message: "Error logging out user" });
      }
      console.log("Token deleted from cache:", response);
      res.status(200).json({ message: "User logged out successfully" });
    });
  } catch (error) {
    console.log("Error logging out user", error);
    res.status(500).json({ message: "Error logging out user" });
  }
});
/*
//add a post 
app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;

    const newPostData = {
      user: userId,
    };

    if (content) {
      newPostData.content = content;
    }

    const newPost = new Post(newPostData);

    await newPost.save();

    res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "post creation failed" });
  }
});

*/


cloudinary.config({
  cloud_name: 'drtjomj6c',
  api_key: '229537777354568',
  api_secret: 'iIHhOpQuFOsOQykvYL-9eMp_Fk0'
});

// API pour créer un post
app.post("/create-post", async (req, res) => {
  try {
    const { content, userId, imagesBase64 } = req.body;

    // Vérifie si tous les champs requis sont présents dans la requête


    if (!userId) {
      return res.status(400).json({ message: 'user not Found .' });
    }



    // Tableau pour stocker les URLs des images téléchargées sur Cloudinary
    const uploadedImages = [];

    // Télécharge chaque image sur Cloudinary et récupère son URL
    for (let i = 0; i < imagesBase64.length; i++) {
      const result = await cloudinary.uploader.upload(imagesBase64[i]);
      uploadedImages.push(result.secure_url);
    }

    // Crée un nouveau post dans la base de données avec le contenu, l'utilisateur et les images
    // (Vous devez utiliser votre propre modèle de données pour créer un nouveau post)
    const newPost = new Post({ content, user: userId, urls: uploadedImages });
    await newPost.save();

    res.status(200).json({ message: "Post enregistré avec succès", uploadedImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du post" });
  }
});


// API pour mettre a jour un user
app.put("/update-user/:id", async (req, res) => {
  try {
    const imageBase64 = req.body.image;
    let uploadedImageURL = '';

    // Télécharge l'image sur Cloudinary et récupère son URL
    const result = await cloudinary.uploader.upload(imageBase64);
    uploadedImageURL = result.secure_url;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.Name,
        lastname: req.body.LastName,
        age: req.body.age,
        bio: req.body.Bio,
        adresse: req.body.Adresse,
        workspace: req.body.Workspace,
        numportable: req.body.NumPortable,
        image: uploadedImageURL, // Stocke une seule URL d'image
        adresse:req.body.Adrsse,
        email:req.body.email,
        password:req.body.password,
        date: req.body.date // Assurez-vous que la date est correctement traitée
      },
      { new: true }
    );
   

    if (!user) {
      return res.status(404).send({
        status: "Error",
        message: "User not found with id " + req.params.id,
      });
    }

    res.status(200).send({
      status: "Ok",
      message: "User updated successfully",
      user: user,
    });
  } 
 catch (err) {
  console.error("Error updating user:", err);
  if (err.name === "Error" && err.http_code === 400 && err.message === "Missing required parameter - file") {
      return res.status(400).send({
          status: "Error",
          message: "Missing required parameter - file",
      });
  } else if (err.kind === "ObjectId") {
      return res.status(404).send({
          status: "Error",
          message: "User not found with id " + req.params.id,
      });
  }
  return res.status(500).send({
      status: "Error",
      message: err.message || "Internal Server Error",
  });
}

});

// API pour mettre à jour le champ count d'un service pour un utilisateur spécifique
app.put("/update-service/:userId/:serviceId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const serviceId = req.params.serviceId;
    const { count } = req.body;

    // Recherche de l'utilisateur dans la table de liste
    const user = await List.findOne({ user: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found in the list" });
    }

    // Recherche du service dans la liste de l'utilisateur
    const serviceIndex = user.packet.findIndex(item => item.Service.toString() === serviceId);
    if (serviceIndex === -1) {
      return res.status(404).json({ message: "Service not found in the user's list" });
    }

    // Mise à jour du champ count du service
    user.packet[serviceIndex].count = count;
    await user.save();

    res.status(200).json({ message: "Service count updated successfully" });
  } catch (error) {
    console.error("Error updating service count:", error);
    res.status(500).json({ message: "Error updating service count" });
  }
});






// Route pour récupérer tous les posts des utilisateurs avec admin="2"
app.get('/posts_entreprise', async (req, res) => {
  try {
    // Récupérer les IDs des utilisateurs avec admin="2"
    const users = await User.find({ admin: "2" }, '_id');

    // Extraire les IDs des utilisateurs
    const userIds = users.map(user => user._id);

    // Récupérer tous les posts des utilisateurs sélectionnés
    const posts = await Post.find({ user: { $in: userIds } }).populate('user');;

    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});












// API pour récupérer tous les posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name image'); // Récupérer tous les posts avec les détails de l'utilisateur
    res.status(200).json({ posts });
  } catch (error) {
    console.log("Error fetching posts", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});


// API pour récupérer un post par son ID
app.get("/post/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ user: userId });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for the specified user ID" });
    }

    // Répondre avec les données des posts trouvés
    const formattedPosts = posts.map(post => {
      const { _id, content, urls, likes, replies, createdAt, __v } = post;
      return { _id, content, urls, user: userId, likes, replies, createdAt, __v };
    });

    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    console.log("Error fetching posts", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});




// API pour récupérer un utilisateur par son ID
app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error fetching user", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// API pour supprimer un post par son ID
app.delete("/deletepost/:postId", async (req, res) => {
  try {
    const postId = req.params.postId.trim(); // Supprimer les espaces vides et les caractères de nouvelle ligne
    console.log('idpost')
    console.log(postId)
    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(postId);


    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
});


// API pour mettre à jour un post
app.put("/update-post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content, urls } = req.body;

    // Vérifie si tous les champs requis sont présents dans la requête
    if (!postId) {
      return res.status(400).json({ message: 'user not found' });
    }

    // Vérifie si le post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post introuvable" });
    }

    // Mettre à jour le contenu et les URLs des images du post
    post.content = content;
    post.urls = urls;
    await post.save();

    res.status(200).json({ message: "Post mis à jour avec succès", updatedPost: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du post" });
  }
});





// API pour créer un nouveau message
app.post("/messages", async (req, res) => {
  try {
    const { content, image, sender, receiver } = req.body;

    // Créer un nouveau message avec les données fournies
    const newMessage = new Msg({
      content,
      image,
      sender,
      receiver,
    });

    // Enregistrer le nouveau message dans la base de données
    await newMessage.save();

    // Répondre avec le message créé
    res.status(201).json({ message: "Message created successfully", newMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: "Error creating message" });
  }
});


// API pour ajouter un ami à un utilisateur
app.post("/add-friend/:userId/:friendId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    // Vérifier si les ID d'utilisateur et d'ami sont valides
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid user or friend ID" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vérifier si l'ami existe
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Vérifier si l'ami n'est pas déjà dans la liste d'amis de l'utilisateur
    if (user.amis.includes(friendId)) {
      return res.status(400).json({ message: "Friend already added" });
    }

    // Ajouter l'ami à la liste d'amis de l'utilisateur
    user.amis.push(friendId);
    await user.save();

    res.status(200).json({ message: "Friend added successfully", user });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ message: "Error adding friend" });
  }
});


// API pour ajouter un prestataire à la liste des prestataires d'un utilisateur
app.post("/add-prestataire/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { prestataireId } = req.body;


    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vérifier si l'ID du prestataire est valide
    if (!mongoose.Types.ObjectId.isValid(prestataireId)) {
      return res.status(400).json({ message: "Invalid prestataire ID" });
    }

    // Vérifier si le prestataire existe
    const prestataire = await Prestataire.findById(prestataireId);
    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire not found" });
    }

    // Vérifier si le prestataire est déjà dans la liste des prestataires de l'utilisateur
    if (user.prestataires.includes(prestataireId)) {
      return res.status(400).json({ message: "Prestataire already added" });
    }

    // Ajouter le prestataire à la liste des prestataires de l'utilisateur
    user.prestataires.push(prestataireId);
    await user.save();

    res.status(200).json({ message: "Prestataire added successfully", user });
  } catch (error) {
    console.error("Error adding prestataire:", error);
    res.status(500).json({ message: "Error adding prestataire" });
  }
});

// API pour récupérer tous les messages entre deux utilisateurs
app.get("/messages/:userId1/:userId2", async (req, res) => {
  try {
    const userId1 = req.params.userId1;
    const userId2 = req.params.userId2;

    // Rechercher tous les messages où sender est égal à userId1 et receiver est égal à userId2
    // OU où sender est égal à userId2 et receiver est égal à userId1
    const messages = await Msg.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.log("Error fetching messages", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// API pour récupérer la liste damis apartire de api
app.get("/friends/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer la liste d'amis de l'utilisateur
    const friends = await User.find({ _id: { $in: user.amis } });

    res.status(200).json({ friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Error fetching friends" });
  }
});






// API pour récupérer la liste des utilisateurs non amis avec l'utilisateur passé en paramètre
app.get("/non-friends0/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Récupérer la liste des amis de l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = user.amis; // Liste des ID d'amis de l'utilisateur

    // Rechercher tous les utilisateurs qui ne sont ni amis ni invités de l'utilisateur
    let nonFriendsQuery = {
      _id: { $nin: friendIds, $ne: userId }
    };

    // Tester si une invitation existe pour l'utilisateur spécifié
    const invitationExists = await Invitation.findOne({ user: userId });
    if (invitationExists) {
      // Si une invitation existe, exclure également les utilisateurs invités
      nonFriendsQuery._id.$nin.push(invitationExists.listeinvite);
    }

    const nonFriends = await User.find(nonFriendsQuery);

    res.status(200).json({ nonFriends });
  } catch (error) {
    console.error("Error fetching non-friends:", error);
    res.status(500).json({ message: "Error fetching non-friends" });
  }
});


app.get("/non-friends/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Récupérer la liste des amis de l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = user.amis; // Liste des ID d'amis de l'utilisateur

    // Récupérer la liste des invitations de l'utilisateur
    const invitations = await Invitation.find({ user: userId });
    const invitedUserIds = invitations.map(invitation => invitation.listeinvite);

    // Rechercher tous les utilisateurs qui ne sont ni amis ni invités de l'utilisateur
    const nonFriends = await User.find({
      _id: { $nin: [...friendIds, ...invitedUserIds, userId] }
    });

    res.status(200).json({ nonFriends });
  } catch (error) {
    console.error("Error fetching non-friends:", error);
    res.status(500).json({ message: "Error fetching non-friends" });
  }
});




app.get("/non-friends2/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Récupérer la liste des amis de l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = user.amis; // Liste des ID d'amis de l'utilisateur

    // Récupérer la liste des invitations de l'utilisateur
    const invitations = await Invitation.findOne({ user: userId });
    const invitedIds = invitations ? invitations.listeinvite : [];

    // Rechercher tous les utilisateurs qui ne sont ni amis ni invités de l'utilisateur
    const nonFriends = await User.find({
      _id: { $nin: [...friendIds, ...invitedIds, userId] } // Exclure les amis, les invités et l'utilisateur lui-même
    });

    res.status(200).json({ nonFriends });
  } catch (error) {
    console.error("Error fetching non-friends:", error);
    res.status(500).json({ message: "Error fetching non-friends" });
  }
});


app.get("/non-invited/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Récupérer la liste des invitations pour l'utilisateur
    const invitations = await Invitation.findOne({ user: userId });
    if (!invitations) {
      // S'il n'y a aucune invitation pour cet utilisateur, tous les utilisateurs sont non invités
      const allUsers = await User.find({ _id: { $ne: userId } });
      return res.status(200).json({ nonInvited: allUsers });
    }

    // Récupérer les IDs des utilisateurs invités
    const invitedUserIds = invitations.listeinvite;

    // Trouver les utilisateurs qui ne sont pas dans la liste des utilisateurs invités
    const nonInvitedUsers = await User.find({ _id: { $nin: invitedUserIds, $ne: userId } });

    res.status(200).json({ nonInvited: nonInvitedUsers });
  } catch (error) {
    console.error("Error fetching non-invited users:", error);
    res.status(500).json({ message: "Error fetching non-invited users" });
  }
});



// API pour ajouter un utilisateur à la liste d'invités dans la table Invitation
app.post("/invitation/:userId/:invitedUserId", async (req, res) => {
  try {
    const invitedUserId = req.params.userId;
    const  userId = req.params.invitedUserId;

    // Vérifier si les ID d'utilisateur et d'utilisateur invité sont valides
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(invitedUserId)) {
      return res.status(400).json({ message: "Invalid user ID or invited user ID" });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Créer une nouvelle invitation ou mettre à jour une invitation existante
    let invitation = await Invitation.findOne({ user: userId });

    if (!invitation) {
      // Si aucune invitation n'existe pour cet utilisateur, créer une nouvelle invitation
      invitation = new Invitation({
        user: userId,
        listeinvite: [invitedUserId],
      });
    } else {
      // Si une invitation existe déjà pour cet utilisateur, ajouter l'utilisateur invité à la liste
      invitation.listeinvite.push(invitedUserId);
    }

    // Enregistrer la nouvelle invitation ou la mise à jour de l'invitation existante dans la base de données
    await invitation.save();

    res.status(200).json({ message: "User added to invitation list successfully" });
  } catch (error) {
    console.error("Error adding user to invitation list:", error);
    res.status(500).json({ message: "Error adding user to invitation list" });
  }
});

// API pour accepter une invitation 
app.post("/accepter/:id1/:id2", async (req, res) => {
  try {
    const userId1 = req.params.id1;
    const userId2 = req.params.id2;

    // Vérifier si les ID d'utilisateur sont valides
    if (!mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(userId2)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    // Vérifier si l'invitation existe
    const invitation = await Invitation.findOne({ user: userId1, listeinvite: userId2 });
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Supprimer l'utilisateur invité de la liste d'invitations de l'utilisateur principal
    await Invitation.findOneAndDelete({ user: userId1, listeinvite: userId2 });

    // Ajouter l'utilisateur invité à la liste d'amis de l'utilisateur principal
    const user1 = await User.findById(userId1);
    if (!user1) {
      return res.status(404).json({ message: "User not found" });
    }
    user1.amis.push(userId2);
    await user1.save();

    // Ajouter l'utilisateur principal à la liste d'amis de l'utilisateur invité
    const user2 = await User.findById(userId2);
    if (!user2) {
      return res.status(404).json({ message: "User not found" });
    }
    user2.amis.push(userId1);
    await user2.save();

    res.status(200).json({ message: "Invitation accepted successfully" });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ message: "Error accepting invitation" });
  }
});
// API pour récupérer la liste des utilisateurs dans les invitations pour un utilisateur donné
app.get("/listeinvitation/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Trouver les invitations pour l'utilisateur donné
    const invitations = await Invitation.find({ user: userId }).populate('listeinvite', ' name lastname image');

    // Extrayer la liste des utilisateurs invités
    const invitedUsers = invitations.map(invitation => invitation.listeinvite);

    res.status(200).json({ invitedUsers });
  } catch (error) {
    console.error("Error fetching invited users:", error);
    res.status(500).json({ message: "Error fetching invited users" });
  }
});




// API pour récupérer la liste des prestataires qui ne sont pas dans la liste des prestataires d'un utilisateur spécifique
app.get("/non-prestataires/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer la liste des ID des prestataires associés à cet utilisateur
    const prestatairesIds = user.prestataires;
console.log(prestatairesIds)
    // Rechercher les utilisateurs ayant admin="3" dont l'ID n'est pas dans la liste des prestataires de l'utilisateur spécifié
    const nonPrestataires = await User.find({ admin: "3", _id: { $nin: prestatairesIds } });

    res.status(200).json({ nonPrestataires });
  } catch (error) {
    console.error("Error fetching non-prestataires:", error);
    res.status(500).json({ message: "Error fetching non-prestataires" });
  }
});

// API pour récupérer la liste des entreprise qui ne sont pas dans la liste des prestataires d'un utilisateur spécifique
app.get("/non-entreprise/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer la liste des ID des prestataires associés à cet utilisateur
    const entreprise = user.entreprises;
console.log(entreprise)
    // Rechercher les utilisateurs ayant admin="2" dont l'ID n'est pas dans la liste des prestataires de l'utilisateur spécifié
    const nonEntreprise = await User.find({ admin: "2", _id: { $nin: entreprise } });

    res.status(200).json({ nonEntreprise });
  } catch (error) {
    console.error("Error fetching non-prestataires:", error);
    res.status(500).json({ message: "Error fetching non-prestataires" });
  }
});


// API pour supprimer une entreprise de la liste des entreprises d'un utilisateur spécifique
app.delete("/supprimer-entreprise/:userId/:entrepriseId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const entrepriseId = req.params.entrepriseId;

    // Vérifier si les ID de l'utilisateur et de l'entreprise sont valides
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(entrepriseId)) {
      return res.status(400).json({ message: "Invalid user or entreprise ID" });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Supprimer l'ID de l'entreprise de la liste des entreprises de l'utilisateur
    user.entreprises = user.entreprises.filter(id => id.toString() !== entrepriseId);
    await user.save();

    res.status(200).json({ message: "Entreprise removed successfully" });
  } catch (error) {
    console.error("Error removing entreprise:", error);
    res.status(500).json({ message: "Error removing entreprise" });
  }
});

// API pour supprimer un prestataire de la liste des prestataires d'un utilisateur spécifique
app.delete("/supprimer-prestataire/:userId/:prestataireId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const prestataireId = req.params.prestataireId;

    // Vérifier si les ID de l'utilisateur et du prestataire sont valides
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(prestataireId)) {
      return res.status(400).json({ message: "Invalid user or prestataire ID" });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Supprimer l'ID du prestataire de la liste des prestataires de l'utilisateur
    user.prestataires = user.prestataires.filter(id => id.toString() !== prestataireId);
    await user.save();

    res.status(200).json({ message: "Prestataire removed successfully" });
  } catch (error) {
    console.error("Error removing prestataire:", error);
    res.status(500).json({ message: "Error removing prestataire" });
  }
});


// API pour ajouter une ID à la liste des prestataires d'un utilisateur spécifique
app.post("/ajouter-prestataire/:userId/:prestataireId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const prestataireId = req.params.prestataireId;

    // Vérifier si les ID de l'utilisateur et du prestataire sont valides
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(prestataireId)) {
      return res.status(400).json({ message: "Invalid user or prestataire ID" });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ajouter l'ID du prestataire à la liste des prestataires de l'utilisateur
    user.prestataires.push(prestataireId);
    await user.save();

    res.status(200).json({ message: "Prestataire added successfully" });
  } catch (error) {
    console.error("Error adding prestataire:", error);
    res.status(500).json({ message: "Error adding prestataire" });
  }
});

// API pour ajouter une ID à la liste des entreprises d'un utilisateur spécifique
app.post("/ajouter-entreprise/:userId/:entrepriseId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const entrepriseId = req.params.entrepriseId;

    // Vérifier si les ID de l'utilisateur et de l'entreprise sont valides
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(entrepriseId)) {
      return res.status(400).json({ message: "Invalid user or entreprise ID" });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ajouter l'ID de l'entreprise à la liste des entreprises de l'utilisateur
    user.entreprises.push(entrepriseId);
    await user.save();

    res.status(200).json({ message: "Entreprise added successfully" });
  } catch (error) {
    console.error("Error adding entreprise:", error);
    res.status(500).json({ message: "Error adding entreprise" });
  }
});


// API pour récupérer la liste des entreprises d'un utilisateur spécifique
app.get("/entreprises-utilisateur/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer la liste des entreprises de l'utilisateur
    const entreprises = await User.find({ _id: { $in: user.entreprises } });

    res.status(200).json({ entreprises });
  } catch (error) {
    console.error("Error fetching user's entreprises:", error);
    res.status(500).json({ message: "Error fetching user's entreprises" });
  }
});


// API pour récupérer la liste des prestatire d'un utilisateur spécifique
app.get("/prestatire-utilisateur/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer la liste des entreprises de l'utilisateur
    const prestataires = await User.find({ _id: { $in: user.prestataires } });

    res.status(200).json({ prestataires });
  } catch (error) {
    console.error("Error fetching user's entreprises:", error);
    res.status(500).json({ message: "Error fetching user's entreprises" });
  }
});

// API pour créer un post
app.post("/create-service", async (req, res) => {
  try {
    const { prix,promo, content, userId, imagesBase64 } = req.body;

    // Vérifie si tous les champs requis sont présents dans la requête


    if (!userId) {
      return res.status(400).json({ message: 'user not Found .' });
    }



    // Tableau pour stocker les URLs des images téléchargées sur Cloudinary
    const uploadedImages = [];

    // Télécharge chaque image sur Cloudinary et récupère son URL
    for (let i = 0; i < imagesBase64.length; i++) {
      const result = await cloudinary.uploader.upload(imagesBase64[i]);
      uploadedImages.push(result.secure_url);
    }

    // Crée un nouveau post dans la base de données avec le contenu, l'utilisateur et les images
    // (Vous devez utiliser votre propre modèle de données pour créer un nouveau post)
    const newService = new Service({ content,prix,promo, user: userId, urls: uploadedImages });
    await newService.save();

    res.status(200).json({ message: "Service enregistré avec succès", uploadedImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du Service" });
  }
});


// API pour récupérer tous les services
app.get('/services', async (req, res) => {
  try {
    // Récupérer tous les services de la base de données
    const services = await Service.find();

    // Envoyer la liste des services en tant que réponse
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des services" });
  }
});

// API pour récupérer tous les services d'un utilisateur spécifique
app.get('/services/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Récupérer tous les services de l'utilisateur spécifié
    const services = await Service.find({ user: userId });

    // Envoyer la liste des services en tant que réponse
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des services de l'utilisateur" });
  }
});

// API pour mettre à jour un service
app.put("/update-service/:serviceId", async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const { prix, promo, content, userId, imagesBase64 } = req.body;

    // Vérifier si tous les champs requis sont présents dans la requête
    if (!serviceId || !userId) {
      return res.status(400).json({ message: 'Service ID or user ID missing.' });
    }

    // Tableau pour stocker les URLs des images téléchargées sur Cloudinary
    const uploadedImages = [];

    // Télécharger chaque image sur Cloudinary et récupérer son URL
    for (let i = 0; i < imagesBase64.length; i++) {
      const result = await cloudinary.uploader.upload(imagesBase64[i]);
      uploadedImages.push(result.secure_url);
    }

    // Mettre à jour le service dans la base de données
    const updatedService = await Service.findByIdAndUpdate(serviceId, {
      content,
      prix,
      promo,
      user: userId, 
      urls: uploadedImages
    }, { new: true });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ message: "Service updated successfully", updatedService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating the service" });
  }
});


// API pour rechercher un utilisateur par nom ou prénom et une chaîne de caractères
app.get("/search-user/:searchString", async (req, res) => {
  try {
    const searchString = req.params.searchString;

    // Rechercher les utilisateurs dont le nom ou le prénom correspond à la chaîne de caractères
    const users = await User.find({
      $or: [
        { name: { $regex: searchString, $options: "i" } }, // Recherche insensible à la casse
        { lastname: { $regex: searchString, $options: "i" } }, // Recherche insensible à la casse
      ]
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found matching the search criteria.' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching for users" });
  }
});

// API pour rechercher une publication par contenu et une chaîne de caractères
app.get("/search-post/:searchString", async (req, res) => {
  try {
    const searchString = req.params.searchString;

    // Rechercher les publications dont le contenu correspond à la chaîne de caractères
    const posts = await Post.find({
      content: { $regex: searchString, $options: "i" } // Recherche insensible à la casse
    }).populate('user');;

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found matching the search criteria.' });
    }

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching for posts" });
  }
});


// API pour rechercher une publication par contenu et une chaîne de caractères
app.get("/search-service/:searchString", async (req, res) => {
  try {
    const searchString = req.params.searchString;

    // Rechercher les publications dont le contenu correspond à la chaîne de caractères
    const servises = await Service.find({
      content: { $regex: searchString, $options: "i" } // Recherche insensible à la casse
    }).populate('user');;

    if (!servises || servises.length === 0) {
      return res.status(404).json({ message: 'No servises found matching the search criteria.' });
    }

    res.status(200).json({ servises });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching for servises" });
  }
});




// API pour supprimer un post par son ID
app.delete("/deleteservice/:serviceId", async (req, res) => {
  try {
    const serviceId = req.params.serviceId.trim(); // Supprimer les espaces vides et les caractères de nouvelle ligne
    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const service = await Service.findById(serviceId);


    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }

    const deletedService= await Service.findByIdAndDelete(serviceId);

    res.status(200).json({ message: "service deleted successfully", deletedService });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
});


// API pour créer un nouveau commentaire
app.post("/comments", async (req, res) => {
  try {
    const { content, sender, post, repender } = req.body;

    // Créer un nouveau commentaire avec les données fournies
    const newComment = new Comenter({
      content,
      sender,
      post,
      repender,
    });

    // Enregistrer le nouveau commentaire dans la base de données
    await newComment.save();

    // Répondre avec le commentaire créé
    res.status(200).json({ message: "Comment created successfully", newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Error creating comment" });
  }
});

// API pour mettre à jour le contenu d'un commentaire
app.put("/update_comments/:commentId", async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    // Vérifier si le commentaire existe
    const comment = await Comenter.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Mettre à jour le contenu du commentaire
    comment.content = content;
    await comment.save();

    // Répondre avec le commentaire mis à jour
    res.status(200).json({ message: "Comment updated successfully", updatedComment: comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment" });
  }
});



// API pour supprimer un commentaire et ses réponses
app.delete("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;

    // Vérifier si le commentaire existe
    const comment = await Comenter.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Rechercher tous les commentaires qui répondent à ce commentaire
    const replies = await Comenter.find({ repender: commentId });

    // Supprimer tous les commentaires réponses
    await Comenter.deleteMany({ repender: commentId });

    // Supprimer le commentaire d'origine
    await Comenter.findByIdAndDelete(commentId);

    // Répondre avec un message de succès
    res.status(200).json({ message: "Comment and its replies deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment and its replies:", error);
    res.status(500).json({ message: "Error deleting comment and its replies" });
  }
});

// API pour récupérer tous les commentaires et les détails de l'utilisateur (sender) de chaque commentaire, dont le repender correspond à l'ID du post passé en paramètre
app.get("/comments/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // Rechercher tous les commentaires dont le repender correspond à l'ID du post passé en paramètre
    const comments = await Comenter.find({ post: postId }).populate('sender');

    // Répondre avec les commentaires et les détails de l'utilisateur de chaque commentaire trouvés
    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments and sender details:", error);
    res.status(500).json({ message: "Error fetching comments and sender details" });
  }
});



// API pour récupérer tous les commentaires qui répondent à un commentaire spécifique
app.get("/comments/replies/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;

    // Rechercher tous les commentaires qui répondent à ce commentaire
    const replies = await Comenter.find({ repender: commentId }).populate('sender');

    // Répondre avec les commentaires trouvés
    res.status(200).json({ replies });
  } catch (error) {
    console.error("Error fetching replies for comment:", error);
    res.status(500).json({ message: "Error fetching replies for comment" });
  }
});



app.post("/add-service/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { serviceId, count } = req.body;

    // Vérifier si l'utilisateur existe
    let user = await List.findOne({ user: userId });

    if (!user) {
      // Si l'utilisateur n'existe pas, créer un nouvel utilisateur avec le service ajouté
      const newList = new List({ user: userId, packet: [{ Service: serviceId, count }] });
      user = await newList.save();
      return res.status(200).json({ message: "New user created with the service added", user: newList });
    }

    // Vérifier si le service existe
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Vérifier si le service existe déjà dans la liste de l'utilisateur
    const existingService = user.packet.find(item => item.Service.toString() === serviceId);
    if (existingService) {
      return res.status(400).json({ message: "Service already exists in the user's list" });
    }

    // Ajouter le nouveau service à la liste de services de l'utilisateur
    user.packet.push({ Service: serviceId, count });
    await user.save();

    res.status(200).json({ message: "Service added to user's list successfully", user });
  } catch (error) {
    console.error("Error adding service to user's list:", error);
    res.status(500).json({ message: "Error adding service to user's list" });
  }
});
// API pour supprimer un service de la liste d'un utilisateur
app.delete("/delete-service/:userId/:serviceId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const  serviceId  = req.params.serviceId;

    // Vérifier si l'utilisateur existe dans la table de liste
    const user = await List.findOne({ user: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found in the list" });
    }

    // Trouver l'index du service dans la liste de services de l'utilisateur
    const serviceIndex = user.packet.findIndex(service => service.Service.toString() === serviceId);

    // Vérifier si le service existe dans la liste de l'utilisateur
    if (serviceIndex === -1) {
      return res.status(404).json({ message: "Service not found in the user's list" });
    }

    // Supprimer le service de la liste de services de l'utilisateur
    user.packet.splice(serviceIndex, 1);
    await user.save();

    res.status(200).json({ message: "Service deleted from user's list successfully", user });
  } catch (error) {
    console.error("Error deleting service from user's list:", error);
    res.status(500).json({ message: "Error deleting service from user's list" });
  }
});


// API pour supprimer toute la liste d'un utilisateur
app.delete("/delete-list/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Recherche de l'utilisateur dans la table de liste
    const user = await List.findOne({ user: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found in the list" });
    }

    // Suppression de toute la liste de l'utilisateur
    await List.findOneAndDelete({ user: userId });

    res.status(200).json({ message: "List deleted successfully for the user" });
  } catch (error) {
    console.error("Error deleting user's list:", error);
    res.status(500).json({ message: "Error deleting user's list" });
  }
});

// API pour récupérer toute la liste avec l'ID utilisateur spécifié
app.get("/get-list/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Recherche de la liste avec l'ID utilisateur spécifié
    const userLists = await List.find({ user: userId });

    if (!userLists || userLists.length === 0) {
      return res.status(404).json({ message: "No lists found for the specified user ID" });
    }

    res.status(200).json({ userLists });
  } catch (error) {
    console.error("Error fetching user's lists:", error);
    res.status(500).json({ message: "Error fetching user's lists" });
  }
});


// API pour mettre à jour le champ count d'un service pour un utilisateur spécifique
app.put("/update-service/:userId/:serviceId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const serviceId = req.params.serviceId;
    const { count } = req.body;

    // Recherche de l'utilisateur dans la table de liste
    const user = await List.findOne({ user: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found in the list" });
    }

    // Recherche du service dans la liste de l'utilisateur
    const serviceIndex = user.packet.findIndex(item => item.Service.toString() === serviceId);
    if (serviceIndex === -1) {
      return res.status(404).json({ message: "Service not found in the user's list" });
    }

    // Mise à jour du champ count du service
    user.packet[serviceIndex].count = count;
    await user.save();

    res.status(200).json({ message: "Service count updated successfully" });
  } catch (error) {
    console.error("Error updating service count:", error);
    res.status(500).json({ message: "Error updating service count" });
  }
});

// API pour vérifier si un service existe dans la liste d'un utilisateur
app.get("/check-service/:userId/:serviceId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const serviceId = req.params.serviceId;

    // Recherche de l'utilisateur dans la table de liste
    const user = await List.findOne({ user: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found in the list" });
    }

    // Recherche du service dans la liste de l'utilisateur
    const serviceIndex = user.packet.findIndex(item => item.Service.toString() === serviceId);
    if (serviceIndex === -1) {
      return res.status(200).json({ message: "Service not found in the user's list" });
    }

    res.status(200).json({ message: "Service found in the user's list" });
  } catch (error) {
    console.error("Error checking service in user's list:", error);
    res.status(500).json({ message: "Error checking service in user's list" });
  }
});




// Route pour obtenir un service par son ID
app.get("/service/:serviceId", async (req, res) => {
  try {
    const serviceId = req.params.serviceId;

    // Recherche du service par son ID dans la base de données
    const service = await Service.findById(serviceId);

    // Vérifier si le service existe
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Si le service existe, le renvoyer en réponse
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Error fetching service" });
  }
});








// API pour créer un nouveau commentaire
app.post("/reclamation", async (req, res) => {
  try {
    const { content, user, repender } = req.body;

    // Créer un nouveau commentaire avec les données fournies
    const newReclamation = new Reclamation({
      content,
      user,
      repender,
    });

    // Enregistrer le nouveau commentaire dans la base de données
    await newReclamation.save();

    // Répondre avec le commentaire créé
    res.status(200).json({ message: "Reclamation created successfully", newReclamation });
  } catch (error) {
    console.error("Error creating Reclamation:", error);
    res.status(500).json({ message: "Error creating Reclamation" });
  }
});


// API pour mettre à jour le champ count d'un service pour un utilisateur spécifique
app.put("/update-Reclamation/:reclamationid", async (req, res) => {
  try {
    const reclamationid = req.params.reclamationid;
    const { repender } = req.body;

    // Recherche de l'utilisateur dans la table de liste
    const reclamation = await Reclamation.findById( reclamationid );
    if (!reclamation) {
      return res.status(404).json({ message: "reclamation not found in the list" });
    }

   
    reclamation.repender=repender;
    await reclamation.save();

    res.status(200).json({ message: "reclamation repender updated successfully" });
  } catch (error) {
    console.error("Error updating reclamation reponder:", error);
    res.status(500).json({ message: "Error updating reclamation Reponder" });
  }
});






// API pour récupérer un post par son ID
app.get("/reclamation/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const reclamation = await Reclamation.find({ user: userId }).populate('user', 'name image');;

    if (!reclamation || reclamation.length === 0) {
      return res.status(404).json({ message: "No reclamations found for the specified user ID" });
    }

    const formattedReclamations = reclamation.map(reclamation => {
      const { _id, content, repender, date_envoie, user } = reclamation;
      const { name, image } = user; // Extraire les données de l'utilisateur
      return { _id, content, repender, date_envoie, user: { name, image } };
    });

    res.status(200).json({ reclamation: formattedReclamations });
  } catch (error) {
    console.log("Error fetching posts", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// API pour récupérer tous les posts
app.get("/reclamations", async (req, res) => {
  try {
    const reclamations = await Reclamation.find().populate('user', 'name image admin'); // Récupérer tous les posts avec les détails de l'utilisateur
    res.status(200).json({ reclamations });
  } catch (error) {
    console.log("Error fetching reclamations", error);
    res.status(500).json({ message: "Error fetching reclamations" });
  }
});
