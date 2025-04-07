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
    const [menuOpen, setMenuOpen] = useState(null);

    const auth = getAuth();
    const user = auth.currentUser;
    const userName = user?.displayName || "Usuário Anônimo";

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
            const postsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            postsData.sort((a, b) => {
                const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
                const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
                return timeB - timeA;
            });
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    if (!userId) {
        console.warn("Aviso: userId não está definido. Usuário precisa estar logado.");
        return <p>Carregando...</p>;
    }

    const handlePostSubmit = async () => {
        if (!newPost.trim()) return;
        try {
            await addDoc(collection(db, "posts"), {
                text: newPost,
                timestamp: new Date(),
                reactions: { like: [], love: [] },
                comments: [],
                userName: userName,
                userId: userId,
            });
            setNewPost("");
        } catch (error) {
            console.error("Erro ao adicionar post:", error);
        }
    };

    const handleDeletePost = async (id) => {
        try {
            await deleteDoc(doc(db, "posts", id));
        } catch (error) {
            console.error("Erro ao deletar post:", error);
        }
    };

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

    const toggleMenu = (postId) => {
        setMenuOpen(menuOpen === postId ? null : postId);
    };

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

    const handleAddComment = async (postId, commentText) => {
        if (!commentText.trim()) return;
        try {
            await updateDoc(doc(db, "posts", postId), {
                comments: arrayUnion({ userName, text: commentText })
            });
        } catch (error) {
            console.error("Erro ao adicionar comentário:", error);
        }
    };

    const handleDeleteComment = async (postId, commentText) => {
        try {
            const postRef = doc(db, "posts", postId);
            const postSnap = await getDoc(postRef);
            if (!postSnap.exists()) return;

            const postData = postSnap.data();
            const updatedComments = postData.comments.filter(comment => comment.text !== commentText);
            await updateDoc(postRef, { comments: updatedComments });
        } catch (error) {
            console.error("Erro ao deletar comentário:", error);
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
                                <div className="edit-post-container">
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <div className="edit-post-actions">
                                    <button onClick={() => handleEditPost(post.id)}>Salvar</button>
                                    <button className="cancel-btn" onClick={() => setEditingPost(null)}>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                                <>
                                    <p><strong>{post.userName}</strong> - {post.text} </p>
                                    <span className="timestamp">
                                        {post.timestamp?.toDate
                                            ? post.timestamp.toDate().toLocaleString()
                                            : new Date(post.timestamp).toLocaleString()}
                                    </span>

                                    {post.userId === userId && (
                                        <>
                                            <button onClick={() => toggleMenu(post.id)} className="post-menu-icon">
                                                ⋮
                                            </button>
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
                                        </>
                                    )}

                                    <div className="reactions">
                                        <button onClick={() => handleReaction(post.id, "like")}>
                                            👍 {(post.reactions?.like || []).map((reaction) => reaction.userName).join(", ")}
                                        </button>
                                        <button onClick={() => handleReaction(post.id, "love")}>
                                        ✅ {(post.reactions?.love || []).map((reaction) => reaction.userName).join(", ")}
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
                    <div className="zero-post"><p>Nenhum post encontrado.</p></div>
                )}
            </div>
        </div>
    );
};

export default PostSection;
