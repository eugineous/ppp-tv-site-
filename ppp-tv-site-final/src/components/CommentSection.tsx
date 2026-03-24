'use client';
import { useState, useEffect } from 'react';
import { timeAgo } from '@/lib/utils';

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  articleSlug: string;
}

export default function CommentSection({ articleSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(articleSlug)}`)
      .then(r => r.ok ? r.json() : { comments: [] })
      .then(d => setComments(d.comments ?? []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [articleSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug, authorName: authorName.trim(), content: content.trim() }),
      });
      if (res.status === 429) throw new Error('Too many comments. Please wait a few minutes.');
      if (res.status === 400) throw new Error('Please fill in all fields correctly.');
      if (!res.ok) throw new Error('Failed to submit. Try again.');
      setSuccess(true);
      setAuthorName('');
      setContent('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  const charLeft = 500 - content.length;

  return (
    <div className="comment-section">
      <h2 className="comment-section-title">
        Comments
        {comments.length > 0 && <span>{comments.length}</span>}
      </h2>

      {/* Submit form */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-form-row">
          <input
            className="comment-input"
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={e => setAuthorName(e.target.value.slice(0, 50))}
            maxLength={50}
            required
            aria-label="Your name"
          />
        </div>
        <textarea
          className="comment-textarea"
          placeholder="Share your thoughts..."
          value={content}
          onChange={e => setContent(e.target.value.slice(0, 500))}
          maxLength={500}
          required
          aria-label="Comment"
        />
        <div className={`comment-char-count${charLeft < 50 ? ' warn' : ''}`}>{charLeft} characters left</div>
        <button className="comment-submit" type="submit" disabled={submitting || !authorName.trim() || !content.trim()}>
          {submitting ? 'Posting…' : 'Post Comment'}
        </button>
        {success && <p className="comment-success">Your comment is awaiting moderation. Thanks!</p>}
        {error && <p className="comment-error">{error}</p>}
      </form>

      {/* Comment list */}
      {loading ? (
        <div className="comment-empty">Loading comments…</div>
      ) : comments.length === 0 ? (
        <div className="comment-empty">No comments yet. Be the first to share your thoughts.</div>
      ) : (
        <div className="comment-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-item-header">
                <div className="comment-avatar">{c.authorName.charAt(0)}</div>
                <span className="comment-author">{c.authorName}</span>
                <span className="comment-time">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="comment-body">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
