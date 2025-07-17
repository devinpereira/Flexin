import React, { useState, useEffect } from 'react';
import { useNotification } from '../../hooks/useNotification';
import AdminLayout from '../../components/Admin/AdminLayout';
import {
  FaSearch, FaFilter, FaTimes, FaEllipsisV, FaFlag,
  FaBan, FaCheck, FaTrash, FaEye, FaExclamationCircle,
  FaDownload, FaSort, FaSortUp, FaSortDown
} from 'react-icons/fa';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import Modal from '../../components/Modal';
import PostView from '../../components/Community/PostView';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Community = () => {
  const { showSuccess, showError } = useNotification();

  // Main state
  const [activeTab, setActiveTab] = useState('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'warning'
  });

  // View modal state
  const [viewItem, setViewItem] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch data for posts
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axiosInstance.get(API_PATHS.POST.GET_POSTS);
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  // Mock data for comments
  const comments = [
    {
      id: 1,
      postId: 1,
      postTitle: 'My fitness journey - 6 months progress',
      content: 'Amazing progress! What was your diet like?',
      author: 'Emily Johnson',
      authorId: 'user234',
      date: '2025-06-15',
      status: 'active',
      reports: 0
    },
    {
      id: 2,
      postId: 1,
      postTitle: 'My fitness journey - 6 months progress',
      content: 'This is really inspiring, thanks for sharing!',
      author: 'David Wilson',
      authorId: 'user567',
      date: '2025-06-15',
      status: 'active',
      reports: 0
    },
    {
      id: 3,
      postId: 2,
      postTitle: 'Best protein supplements for vegans',
      content: 'I tried the pea protein you mentioned and it was great.',
      author: 'Linda Brown',
      authorId: 'user890',
      date: '2025-06-14',
      status: 'active',
      reports: 0
    },
    {
      id: 4,
      postId: 3,
      postTitle: 'How to stay motivated during winter',
      content: 'This advice doesn\'t really work. Terrible post!',
      author: 'Angry User',
      authorId: 'user111',
      date: '2025-06-11',
      status: 'flagged',
      reports: 3
    },
    {
      id: 5,
      postId: 4,
      postTitle: 'Training routine for beginners',
      content: 'Check out my profile for even better routines [LINK REMOVED]',
      author: 'Spam Account',
      authorId: 'user222',
      date: '2025-06-09',
      status: 'removed',
      reports: 5
    }
  ];

  // Mock data for reported users
  const reportedUsers = [
    {
      id: 'user111',
      username: 'Angry User',
      email: 'angry@example.com',
      joinDate: '2025-05-15',
      status: 'flagged',
      reports: 5,
      reason: 'Abusive language, harassment'
    },
    {
      id: 'user222',
      username: 'Spam Account',
      email: 'spam@example.com',
      joinDate: '2025-05-01',
      status: 'suspended',
      reports: 12,
      reason: 'Spam, unauthorized promotion'
    },
    {
      id: 'user999',
      username: 'Spammer Account',
      email: 'spammer@example.com',
      joinDate: '2025-05-20',
      status: 'banned',
      reports: 28,
      reason: 'Multiple spam posts, fake accounts'
    }
  ];

  // Sort function for dynamic sorting
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special cases
      if (sortField === 'title' && activeTab === 'comments') {
        aValue = a.content;
        bValue = b.content;
      } else if (sortField === 'title' && activeTab === 'users') {
        aValue = a.username;
        bValue = b.username;
      }

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Number comparison
      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });
  };

  // Filter and sort data based on status, search query, and sort settings
  const getFilteredItems = () => {
    let items = [];
    let filterFn;

    switch (activeTab) {
      case 'posts':
        items = posts;
        filterFn = post => {
          const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
          const matchesSearch = post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesStatus && matchesSearch;
        };
        break;

      case 'comments':
        items = comments;
        filterFn = comment => {
          const matchesStatus = selectedStatus === 'all' || comment.status === selectedStatus;
          const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesStatus && matchesSearch;
        };
        break;

      case 'users':
        items = reportedUsers;
        filterFn = user => {
          const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
          const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesStatus && matchesSearch;
        };
        break;

      default:
        return [];
    }

    const filteredItems = items.filter(filterFn);
    return sortItems(filteredItems);
  };

  const filteredItems = getFilteredItems();

  // Get counts for status tabs
  const getCounts = () => {
    const currentItems = activeTab === 'posts'
      ? posts
      : activeTab === 'comments'
        ? comments
        : reportedUsers;

    return {
      all: currentItems.length,
      active: currentItems.filter(item => item.status === 'active').length,
      flagged: currentItems.filter(item => item.status === 'flagged').length,
      removed: currentItems.filter(item => item.status === 'removed').length,
      suspended: currentItems.filter(item => item.status === 'suspended').length || 0,
      banned: currentItems.filter(item => item.status === 'banned').length || 0
    };
  };

  const counts = getCounts();

  // Handle sort click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle status change with confirmation
  const handleStatusChange = (item, type, newStatus) => {
    let title, message;

    switch (newStatus) {
      case 'removed':
        title = 'Remove Content';
        message = `Are you sure you want to remove this ${type}? The content will be hidden from users but remain in the database.`;
        break;
      case 'banned':
        title = 'Ban User';
        message = 'Are you sure you want to ban this user? This will permanently block the user from accessing the platform.';
        break;
      case 'suspended':
        title = 'Suspend User';
        message = 'Are you sure you want to suspend this user? The user will be temporarily blocked from accessing the platform.';
        break;
      case 'active':
        title = 'Restore Content';
        message = `Are you sure you want to restore this ${type}? It will be visible to all users again.`;
        break;
      default:
        title = 'Change Status';
        message = `Are you sure you want to change the status of this ${type} to ${newStatus}?`;
    }

    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        // In a real app, this would call an API to update the status
        const updateStatus = async () => {
          try {
            if (type === 'post') {
              await axiosInstance.patch(API_PATHS.POST.FLAG_POST(item._id), { status: newStatus });
            } else {
              return;
            }
            showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} status updated to ${newStatus}`);
          } catch (error) {
            showError('Error updating status');
            console.error(error);
          }
        };
        updateStatus();
      },
      type: 'warning'
    });
  };

  // Handle delete with confirmation
  const handleDelete = (item, type) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      message: `Are you sure you want to permanently delete this ${type}? This action cannot be undone.`,
      onConfirm: () => {
        // In a real app, this would call an API to delete the item
        const removePost = async () => {
          try {
            if (type === 'post') {
              await axiosInstance.patch(API_PATHS.POST.REMOVE_POST(item._id));
            } else {
              return;
            }
            showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
          } catch (error) {
            showError('Error deleting post');
            console.error(error);
          }
        };
        removePost();
      },
      type: 'danger'
    });
  };

  // Handle view details
  const handleView = (item, type) => {
    setViewItem({ item, type });
  };

  // Close view modal
  const handleCloseView = () => {
    setViewItem(null);
  };

  // Export data as CSV
  const handleExport = () => {
    setIsLoading(true);

    try {
      let headers;
      let csvData;

      if (activeTab === 'posts') {
        headers = ['ID', 'Title', 'Author', 'Date', 'Status', 'Likes', 'Comments', 'Reports'];
        csvData = filteredItems.map(post => [
          post.id,
          post.title,
          post.author,
          post.date,
          post.status,
          post.likes,
          post.comments,
          post.reports
        ]);
      } else if (activeTab === 'comments') {
        headers = ['ID', 'Content', 'Post', 'Author', 'Date', 'Status', 'Reports'];
        csvData = filteredItems.map(comment => [
          comment.id,
          comment.content,
          comment.postTitle,
          comment.author,
          comment.date,
          comment.status,
          comment.reports
        ]);
      } else {
        headers = ['ID', 'Username', 'Email', 'Join Date', 'Status', 'Reports', 'Reason'];
        csvData = filteredItems.map(user => [
          user.id,
          user.username,
          user.email,
          user.joinDate,
          user.status,
          user.reports,
          user.reason
        ]);
      }

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${activeTab}-export.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} data exported successfully`);
    } catch (error) {
      showError('Error exporting data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setShowFilters(false);
    setSortField('date');
    setSortDirection('desc');
  };

  // Render status badge with appropriate colors
  const renderStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500',
      flagged: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      removed: 'bg-red-500/20 text-red-400 border-red-500',
      suspended: 'bg-orange-500/20 text-orange-400 border-orange-500',
      banned: 'bg-red-500/20 text-red-400 border-red-500'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status] || 'bg-gray-500/20 text-gray-400 border-gray-500'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;

    return sortDirection === 'asc'
      ? <FaSortUp className="inline ml-1" />
      : <FaSortDown className="inline ml-1" />;
  };

  // UI Components for different content tables
  const renderPostsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
              Title {renderSortIndicator('title')}
            </th>
            <th className="text-left py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('author')}>
              Author {renderSortIndicator('author')}
            </th>
            <th className="text-center py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('date')}>
              Date {renderSortIndicator('date')}
            </th>
            <th className="text-center py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
              Status {renderSortIndicator('status')}
            </th>
            <th className="text-center py-3 px-4 text-white/70">
              Engagement
            </th>
            <th className="text-center py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('reports')}>
              Reports {renderSortIndicator('reports')}
            </th>
            <th className="text-center py-3 px-4 text-white/70">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((post) => (
            <tr key={post._id} className="border-b border-white/5 hover:bg-[#1d1d3a] transition-colors">
              <td className="py-3 px-4 text-white">{post.description}</td>
              <td className="py-3 px-4 text-white">{post.author}</td>
              <td className="py-3 px-4 text-center text-white/70">{post.createdAt}</td>
              <td className="py-3 px-4 text-center">{renderStatusBadge(post.status)}</td>
              <td className="py-3 px-4 text-center text-white/70">
                {post.likes} likes • {post.comments} comments
              </td>
              <td className="py-3 px-4 text-center">
                {post.reports > 0 ? (
                  <span className="text-yellow-400 font-medium">{post.reports}</span>
                ) : (
                  <span className="text-white/70">{post.reports}</span>
                )}
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleView(post, 'post')}
                    className="p-2 text-white/70 hover:text-blue-400 transition-colors"
                    title="View Post"
                  >
                    <FaEye size={16} />
                  </button>
                  {post.status === 'active' ? (
                    <button
                      onClick={() => handleStatusChange(post, 'post', 'flagged')}
                      className="p-2 text-white/70 hover:text-red-400 transition-colors"
                      title="Flag Post"
                    >
                      <FaBan size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(post, 'post', 'active')}
                      className="p-2 text-white/70 hover:text-green-400 transition-colors"
                      title="Restore Post"
                    >
                      <FaCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(post, 'post')}
                    className="p-2 text-white/70 hover:text-red-500 transition-colors"
                    title="Delete Post"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <FaExclamationCircle className="text-white/30 text-4xl mx-auto mb-3" />
          <p className="text-white/70">No posts found matching your criteria</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-3 py-1 bg-[#f67a45]/20 text-[#f67a45] rounded hover:bg-[#f67a45]/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );

  const renderCommentsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('content')}>
              Content {renderSortIndicator('content')}
            </th>
            <th className="text-left py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('postTitle')}>
              Post {renderSortIndicator('postTitle')}
            </th>
            <th className="text-left py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('author')}>
              Author {renderSortIndicator('author')}
            </th>
            <th className="text-center py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('date')}>
              Date {renderSortIndicator('date')}
            </th>
            <th className="text-center py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
              Status {renderSortIndicator('status')}
            </th>
            <th className="text-center py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('reports')}>
              Reports {renderSortIndicator('reports')}
            </th>
            <th className="text-center py-3 px-4 text-white/70">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((comment) => (
            <tr key={comment.id} className="border-b border-white/5 hover:bg-[#1d1d3a] transition-colors">
              <td className="py-3 px-4 text-white max-w-xs truncate">{comment.content}</td>
              <td className="py-3 px-4 text-white/70 max-w-xs truncate">{comment.postTitle}</td>
              <td className="py-3 px-4 text-white">{comment.author}</td>
              <td className="py-3 px-4 text-center text-white/70">{comment.date}</td>
              <td className="py-3 px-4 text-center">{renderStatusBadge(comment.status)}</td>
              <td className="py-3 px-4 text-center">
                {comment.reports > 0 ? (
                  <span className="text-yellow-400 font-medium">{comment.reports}</span>
                ) : (
                  <span className="text-white/70">{comment.reports}</span>
                )}
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center gap-2">
                  {comment.status === 'active' ? (
                    <button
                      onClick={() => handleStatusChange(comment, 'comment', 'removed')}
                      className="p-2 text-white/70 hover:text-red-400 transition-colors"
                      title="Remove Comment"
                    >
                      <FaBan size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(comment, 'comment', 'active')}
                      className="p-2 text-white/70 hover:text-green-400 transition-colors"
                      title="Restore Comment"
                    >
                      <FaCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment, 'comment')}
                    className="p-2 text-white/70 hover:text-red-500 transition-colors"
                    title="Delete Comment"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <FaExclamationCircle className="text-white/30 text-4xl mx-auto mb-3" />
          <p className="text-white/70">No comments found matching your criteria</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-3 py-1 bg-[#f67a45]/20 text-[#f67a45] rounded hover:bg-[#f67a45]/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );

  const renderUsersTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('username')}>
              Username {renderSortIndicator('username')}
            </th>
            <th className="text-left py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('email')}>
              Email {renderSortIndicator('email')}
            </th>
            <th className="text-center py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('joinDate')}>
              Join Date {renderSortIndicator('joinDate')}
            </th>
            <th className="text-center py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
              Status {renderSortIndicator('status')}
            </th>
            <th className="text-center py-3 px-4 text-white/70 cursor-pointer hover:text-white" onClick={() => handleSort('reports')}>
              Reports {renderSortIndicator('reports')}
            </th>
            <th className="text-left py-3 px-4 text-white/70">
              Reason
            </th>
            <th className="text-center py-3 px-4 text-white/70">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((user) => (
            <tr key={user.id} className="border-b border-white/5 hover:bg-[#1d1d3a] transition-colors">
              <td className="py-3 px-4 text-white">{user.username}</td>
              <td className="py-3 px-4 text-white/70">{user.email}</td>
              <td className="py-3 px-4 text-center text-white/70">{user.joinDate}</td>
              <td className="py-3 px-4 text-center">{renderStatusBadge(user.status)}</td>
              <td className="py-3 px-4 text-center">
                <span className="text-yellow-400 font-medium">{user.reports}</span>
              </td>
              <td className="py-3 px-4 text-white/70 max-w-xs truncate">{user.reason}</td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleView(user, 'user')}
                    className="p-2 text-white/70 hover:text-blue-400 transition-colors"
                    title="View User Profile"
                  >
                    <FaEye size={16} />
                  </button>
                  {user.status !== 'banned' && (
                    <button
                      onClick={() => handleStatusChange(user, 'user', 'banned')}
                      className="p-2 text-white/70 hover:text-red-500 transition-colors"
                      title="Ban User"
                    >
                      <FaBan size={16} />
                    </button>
                  )}
                  {user.status !== 'suspended' && user.status !== 'banned' && (
                    <button
                      onClick={() => handleStatusChange(user, 'user', 'suspended')}
                      className="p-2 text-white/70 hover:text-yellow-400 transition-colors"
                      title="Suspend User"
                    >
                      <FaFlag size={16} />
                    </button>
                  )}
                  {(user.status === 'suspended' || user.status === 'flagged') && (
                    <button
                      onClick={() => handleStatusChange(user, 'user', 'active')}
                      className="p-2 text-white/70 hover:text-green-400 transition-colors"
                      title="Restore User"
                    >
                      <FaCheck size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <FaExclamationCircle className="text-white/30 text-4xl mx-auto mb-3" />
          <p className="text-white/70">No users found matching your criteria</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-3 py-1 bg-[#f67a45]/20 text-[#f67a45] rounded hover:bg-[#f67a45]/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout pageTitle="Community Management">
      {/* Page header with export button */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button
            onClick={handleExport}
            disabled={isLoading || filteredItems.length === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${filteredItems.length === 0
                ? 'bg-[#1d1d3a] text-white/40 cursor-not-allowed'
                : 'bg-[#1d1d3a] text-white/70 hover:text-white hover:bg-[#2d2d4a]'
              }`}
          >
            <FaDownload size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {
            setActiveTab('posts');
            setSelectedStatus('all');
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'posts'
              ? 'bg-[#f67a45] text-white'
              : 'bg-[#1d1d3a] text-white/70 hover:text-white'
            }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('comments');
            setSelectedStatus('all');
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'comments'
              ? 'bg-[#f67a45] text-white'
              : 'bg-[#1d1d3a] text-white/70 hover:text-white'
            }`}
        >
          Comments ({comments.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('users');
            setSelectedStatus('all');
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'users'
              ? 'bg-[#f67a45] text-white'
              : 'bg-[#1d1d3a] text-white/70 hover:text-white'
            }`}
        >
          Reported Users ({reportedUsers.length})
        </button>
      </div>

      {/* Filters section */}
      <div className="bg-[#121225] rounded-lg p-4 mb-6 border border-white/5">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1d1d3a] text-white border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#f67a45]"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-[#1d1d3a] text-white/70 hover:text-white rounded-lg transition-colors"
            >
              <FaFilter size={14} />
              <span>Filters</span>
              {selectedStatus !== 'all' && (
                <span className="w-2 h-2 rounded-full bg-[#f67a45]"></span>
              )}
            </button>

            {selectedStatus !== 'all' && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-2 bg-[#1d1d3a] text-white/70 hover:text-white rounded-lg transition-colors"
              >
                <FaTimes size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-[#1d1d3a] text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#f67a45]"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="flagged">Flagged</option>
                  <option value="removed">Removed</option>
                  {activeTab === 'users' && (
                    <>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Sort By</label>
                <select
                  value={sortField}
                  onChange={(e) => {
                    setSortField(e.target.value);
                    setSortDirection('desc');
                  }}
                  className="w-full bg-[#1d1d3a] text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#f67a45]"
                >
                  {activeTab === 'posts' && (
                    <>
                      <option value="date">Date</option>
                      <option value="title">Title</option>
                      <option value="author">Author</option>
                      <option value="reports">Reports</option>
                      <option value="likes">Likes</option>
                      <option value="comments">Comments</option>
                    </>
                  )}

                  {activeTab === 'comments' && (
                    <>
                      <option value="date">Date</option>
                      <option value="content">Content</option>
                      <option value="author">Author</option>
                      <option value="postTitle">Post</option>
                      <option value="reports">Reports</option>
                    </>
                  )}

                  {activeTab === 'users' && (
                    <>
                      <option value="joinDate">Join Date</option>
                      <option value="username">Username</option>
                      <option value="reports">Reports</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Sort Order</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSortDirection('asc')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${sortDirection === 'asc'
                        ? 'bg-[#f67a45]/20 text-[#f67a45] border border-[#f67a45]/30'
                        : 'bg-[#1d1d3a] text-white/70 hover:text-white border border-transparent'
                      }`}
                  >
                    Ascending
                  </button>
                  <button
                    onClick={() => setSortDirection('desc')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${sortDirection === 'desc'
                        ? 'bg-[#f67a45]/20 text-[#f67a45] border border-[#f67a45]/30'
                        : 'bg-[#1d1d3a] text-white/70 hover:text-white border border-transparent'
                      }`}
                  >
                    Descending
                  </button>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full px-3 py-2 bg-[#1d1d3a] text-white/70 hover:text-white rounded-lg transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 border-b border-white/10">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${selectedStatus === 'all'
                ? 'border-[#f67a45] text-[#f67a45]'
                : 'border-transparent text-white/50 hover:text-white/70'
              }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setSelectedStatus('active')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${selectedStatus === 'active'
                ? 'border-green-500 text-green-400'
                : 'border-transparent text-white/50 hover:text-white/70'
              }`}
          >
            Active ({counts.active})
          </button>
          <button
            onClick={() => setSelectedStatus('flagged')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${selectedStatus === 'flagged'
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-white/50 hover:text-white/70'
              }`}
          >
            Flagged ({counts.flagged})
          </button>
          {activeTab !== 'users' && (
            <button
              onClick={() => setSelectedStatus('removed')}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${selectedStatus === 'removed'
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-white/50 hover:text-white/70'
                }`}
            >
              Removed ({counts.removed})
            </button>
          )}
          {activeTab === 'users' && (
            <>
              <button
                onClick={() => setSelectedStatus('suspended')}
                className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${selectedStatus === 'suspended'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-white/50 hover:text-white/70'
                  }`}
              >
                Suspended ({counts.suspended})
              </button>
              <button
                onClick={() => setSelectedStatus('banned')}
                className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${selectedStatus === 'banned'
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-white/50 hover:text-white/70'
                  }`}
              >
                Banned ({counts.banned})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Tables */}
      <div className="bg-[#121225] rounded-lg p-4 border border-white/5 mb-8">
        {activeTab === 'posts' && renderPostsTable()}
        {activeTab === 'comments' && renderCommentsTable()}
        {activeTab === 'users' && renderUsersTable()}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        type={confirmDialog.type}
      />

      {/* View Modal */}
      <Modal
        isOpen={viewItem !== null}
        onClose={handleCloseView}
        title={viewItem?.type === 'post' ? 'View Post' :
          viewItem?.type === 'comment' ? 'View Comment' : 'View User'}
        size="lg"
      >
        {viewItem?.type === 'post' && (
          <PostView post={viewItem.item} onClose={handleCloseView} />
        )}
        {viewItem?.type === 'comment' && (
          <div className="bg-[#1d1d3a] rounded-lg p-6">
            <h3 className="text-white font-medium mb-2">Post: {viewItem.item.postTitle}</h3>
            <p className="text-white/70 mb-4">{viewItem.item.content}</p>
            <div className="text-white/50 text-sm">
              By {viewItem.item.author} • {viewItem.item.date}
            </div>
          </div>
        )}
        {viewItem?.type === 'user' && (
          <div className="bg-[#1d1d3a] rounded-lg p-6">
            <h3 className="text-white font-medium mb-2">{viewItem.item.username}</h3>
            <p className="text-white/70 mb-2">Email: {viewItem.item.email}</p>
            <p className="text-white/70 mb-2">Join Date: {viewItem.item.joinDate}</p>
            <p className="text-white/70 mb-4">Reports: {viewItem.item.reports}</p>
            <p className="text-red-400">Reason: {viewItem.item.reason}</p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Community;
