import { db } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, addDoc, getDocs, onSnapshot, doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import "./PostSection.css";

const PostSection = ({ userId }) => {
  
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [editingPost, setEditingPost] = useState(null);
    const [editText, setEditText] = useState("");
    const [menuOpen, setMenuOpen] = useState(null); // Armazena qual post está com o menu aberto

    const auth = getAuth();
    const user = auth.currentUser; // Obtém o usuário logado
    const userName = user?.displayName || "Usuário Anônimo";

    // Busca os posts em tempo real e ordena do mais recente para o mais antigo
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
            const postsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Ordenação dos posts por timestamp
            postsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    if (!userId) {
      console.warn("Aviso: userId não está definido. Usuário precisa estar logado.");
      return <p>Carregando...</p>;
    }

    // Adicionar um novo post
    const handlePostSubmit = async () => {
        if (!newPost.trim()) return;
        try {
            await addDoc(collection(db, "posts"), {
                text: newPost,
                timestamp: new Date(),
                reactions: { like: [], love: [] },
                comments: [],
                userName: userName, // Usa o nome do usuário logado
            });
            setNewPost("");
        } catch (error) {
            console.error("Erro ao adicionar post:", error);
        }
    };

    // Deletar um post
    const handleDeletePost = async (id) => {
        try {
            await deleteDoc(doc(db, "posts", id));
        } catch (error) {
            console.error("Erro ao deletar post:", error);
        }
    };

    // Editar um post
    const handleEditPost = async (id) => {
        if (!editText.trim()) return;
        try {
            await updateDoc(doc(db, "posts", id), {
                text: editText
            });
            setEditingPost(null);
            setEditText("");
        } catch (error) {
            console.error("Erro ao editar post:", error);
        }
    };

    // Reagir ao post (like/love)
    const handleReaction = async (postId, type) => {
      if (!userId) {
          console.error("Erro: userId indefinido");
          return;
      }

      try {
          const postRef = doc(db, "posts", postId);
          const postSnapshot = await getDoc(postRef);

          if (!postSnapshot.exists()) {
              console.error("Erro: Post não encontrado");
              return;
          }

          const postData = postSnapshot.data();
          const currentReactions = postData.reactions?.[type] || [];

          if (currentReactions.some(reaction => reaction.userId === userId)) {
              await updateDoc(postRef, {
                  [`reactions.${type}`]: arrayRemove({ userId, userName: userName })
              });
          } else {
              await updateDoc(postRef, {
                  [`reactions.${type}`]: arrayUnion({ userId, userName: userName })
              });
          }
      } catch (error) {
          console.error("Erro ao reagir ao post:", error);
      }
  };

    // Adicionar um comentário
    const handleAddComment = async (id, comment) => {
      if (!comment.trim()) return;
      try {
          await updateDoc(doc(db, "posts", id), {
              comments: arrayUnion({ text: comment, userName: userName }) // Adiciona o nome do usuário no comentário
          });
      } catch (error) {
          console.error("Erro ao adicionar comentário:", error);
      }
  };

    // Excluir um comentário
    const handleDeleteComment = async (postId, commentText) => {
        try {
            const postRef = doc(db, "posts", postId);
            const postSnapshot = await getDoc(postRef);

            if (!postSnapshot.exists()) {
                console.error("Erro: Post não encontrado");
                return;
            }

            const postData = postSnapshot.data();
            const updatedComments = postData.comments.filter(comment => comment.text !== commentText); // Remove o comentário com base no texto

            await updateDoc(postRef, {
                comments: updatedComments
            });
        } catch (error) {
            console.error("Erro ao excluir comentário:", error);
        }
    };

    // Função para alternar a visibilidade do menu suspenso
    const toggleMenu = (postId) => {
        if (menuOpen === postId) {
            setMenuOpen(null); // Fecha o menu se já estiver aberto
        } else {
            setMenuOpen(postId); // Abre o menu para o post selecionado
        }
    };

    return (
        <div className="post-section">
            <div className="post-input">
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Digite sua tarefa..."
                />
                <button onClick={handlePostSubmit}>Postar</button>
            </div>
            <div className="timeline">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="post-item">
                            {editingPost === post.id ? (
                                <>
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                    />
                                    <button onClick={() => handleEditPost(post.id)}>Salvar</button>
                                    <button onClick={() => setEditingPost(null)}>Cancelar</button>
                                </>
                            ) : (
                                <>
                                    <p><strong>{post.userName}</strong> - {post.text} </p>
                                    <span className="timestamp">
                                        {post.timestamp?.toDate
                                            ? post.timestamp.toDate().toLocaleString()
                                            : new Date(post.timestamp).toLocaleString()}
                                    </span>

                                    {/* Ícone de 3 bolinhas */}
                                    <button onClick={() => toggleMenu(post.id)} className="post-menu-icon">
                                        ⋮
                                    </button>

                                    {/* Menu suspenso */}
                                    {menuOpen === post.id && (
                                        <div className="dropdown-menu">
                                            <button onClick={() => { setEditingPost(post.id); setEditText(post.text); }} >
                                                ✏ Editar
                                            </button>
                                            <button onClick={() => handleDeletePost(post.id)}>
                                                🗑 Deletar
                                            </button>
                                        </div>
                                    )}

                                    <div className="reactions">
                                        <button onClick={() => handleReaction(post.id, "like")}>
                                            👍 {(post.reactions?.like || []).map((reaction) => reaction.userName).join(", ")}
                                        </button>
                                        <button onClick={() => handleReaction(post.id, "love")}>
                                            ❤️ {(post.reactions?.love || []).map((reaction) => reaction.userName).join(", ")}
                                        </button>
                                    </div>

                                    <div className="comments">
                                        <input
                                            type="text"
                                            placeholder="Adicione um comentário..."
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddComment(post.id, e.target.value);
                                            }}
                                        />
                                        <ul>
                                            {post.comments?.map((comment, index) => (
                                                <li key={index} className="comment-item">
                                                    <span>
                                                        <strong>{comment.userName}</strong>: {comment.text}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteComment(post.id, comment.text)}
                                                        className="delete-comment-btn"
                                                    >
                                                        🗑
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Nenhum post encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default PostSection;
