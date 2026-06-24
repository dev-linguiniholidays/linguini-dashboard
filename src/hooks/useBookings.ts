import { useState, useEffect } from 'react';
import { Booking, Comment, Expense } from '@/lib/types';
import { bookingService, bookingCommentService, bookingExpenseService, convertDbBookingToFrontend, convertFrontendBookingToDb, convertPartialFrontendBookingToDb, customerService } from '@/lib/database';
import { supabase } from '@/lib/supabase';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      try {
        if (supabase) {
          const dbBookings = await bookingService.getAll();
          const frontendBookings = dbBookings.map(convertDbBookingToFrontend);
          
          const bookingsWithCommentsAndExpenses = await Promise.all(
            frontendBookings.map(async (booking) => {
              const [comments, expenses] = await Promise.all([
                bookingCommentService.getByBookingId(booking.id),
                bookingExpenseService.getByBookingId(booking.id)
              ]);
              return {
                ...booking,
                comments: comments.map(comment => ({
                  id: comment.id,
                  text: comment.text,
                  userId: comment.user_id,
                  userName: comment.user_name,
                  timestamp: comment.created_at,
                })),
                expenses
              };
            })
          );
          
          setBookings(bookingsWithCommentsAndExpenses);

          try {
            const [destinations, assignees] = await Promise.all([
              bookingService.getUniqueDestinations(),
              customerService.getUniqueAssignees() // Reuse advisor/assignee list
            ]);
            setDestinationOptions(destinations);
            setAssigneeOptions(assignees);
          } catch (filterError) {
            console.error('Error loading filter options:', filterError);
            setDestinationOptions([]);
            setAssigneeOptions([]);
          }
        } else {
          setBookings([]);
          setDestinationOptions([]);
          setAssigneeOptions([]);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
        setBookings([]);
        setDestinationOptions([]);
        setAssigneeOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const addBooking = async (newBooking: Omit<Booking, 'id' | 'updatedAt' | 'comments' | 'expenses'>) => {
    try {
      if (supabase) {
        const dbBooking = convertFrontendBookingToDb(newBooking);
        const createdBooking = await bookingService.create(dbBooking);
        const frontendBooking = convertDbBookingToFrontend(createdBooking);
        setBookings(prev => [frontendBooking, ...prev]);
      } else {
        const booking: Booking = {
          ...newBooking,
          id: Date.now().toString(),
          updatedAt: new Date().toISOString(),
          comments: [],
          expenses: [],
        };
        setBookings(prev => [...prev, booking]);
      }
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  };

  const updateBooking = async ({ id, ...updates }: Partial<Booking> & { id: string }) => {
    try {
      if (supabase) {
        const dbUpdates = convertPartialFrontendBookingToDb(updates);
        const updatedBooking = await bookingService.update(id, dbUpdates);
        const frontendBooking = convertDbBookingToFrontend(updatedBooking);
        setBookings(prev => prev.map(b => 
          b.id === id 
            ? { ...frontendBooking, comments: b.comments, expenses: b.expenses }
            : b
        ));
      } else {
        setBookings(prev => prev.map(b => 
          b.id === id 
            ? { ...b, ...updates, updatedAt: new Date().toISOString() }
            : b
        ));
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      if (supabase) {
        await bookingService.delete(id);
        setBookings(prev => prev.filter(b => b.id !== id));
      } else {
        setBookings(prev => prev.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  };

  const addComment = async ({ bookingId, text, userId, userName }: { 
    bookingId: string; 
    text: string; 
    userId: string; 
    userName: string; 
  }) => {
    try {
      if (supabase) {
        const comment = await bookingCommentService.add({
          booking_id: bookingId,
          text,
          user_id: userId,
          user_name: userName,
        });
        
        const newComment: Comment = {
          id: comment.id,
          text: comment.text,
          userId: comment.user_id,
          userName: comment.user_name,
          timestamp: comment.created_at,
        };
        
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, comments: [newComment, ...booking.comments] }
            : booking
        ));
      } else {
        const newComment: Comment = {
          id: Date.now().toString(),
          text,
          userId,
          userName,
          timestamp: new Date().toISOString(),
        };
        
        setBookings(prev => prev.map(b => 
          b.id === bookingId 
            ? { 
                ...b, 
                comments: [newComment, ...b.comments],
                updatedAt: new Date().toISOString()
              }
            : b
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const addExpense = async ({ bookingId, amount, category, description, userId, userName }: {
    bookingId: string;
    amount: number;
    category: 'Hotel' | 'Taxi' | 'Bus' | 'Guide' | 'Travel Hamper' | 'Medical Kit' | 'Misc.';
    description: string;
    userId: string;
    userName: string;
  }) => {
    try {
      if (supabase) {
        const expense = await bookingExpenseService.add({
          booking_id: bookingId,
          amount,
          category,
          description,
          user_id: userId,
          user_name: userName,
        });

        setBookings(prev => prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, expenses: [...booking.expenses, expense] }
            : booking
        ));
      } else {
        const newExpense: Expense = {
          id: Date.now().toString(),
          amount,
          category,
          description,
          userId,
          userName,
          timestamp: new Date().toISOString(),
        };

        setBookings(prev => prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, expenses: [...booking.expenses, newExpense], updatedAt: new Date().toISOString() }
            : booking
        ));
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (bookingId: string, expenseId: string) => {
    try {
      if (supabase) {
        await bookingExpenseService.delete(expenseId);
      }
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, expenses: booking.expenses.filter(e => e.id !== expenseId) }
          : booking
      ));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  return {
    bookings,
    isLoading,
    error: null,
    addBooking,
    updateBooking,
    deleteBooking,
    addComment,
    addExpense,
    deleteExpense,
    destinationOptions,
    assigneeOptions,
  };
};

export const useBooking = (id: string) => {
  const { bookings } = useBookings();
  return bookings.find(booking => booking.id === id);
};

export const useBookingSearch = (bookings: Booking[], destinationOptions: string[] = [], assigneeOptions: string[] = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookings);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      const hasFilters = searchTerm !== '' || 
        statusFilter !== 'all' || 
        destinationFilter !== 'all' || 
        leadTypeFilter !== 'all' ||
        serviceFilter !== 'all' ||
        assigneeFilter !== 'all';

      if (!hasFilters) {
        setFilteredBookings(bookings);
        return;
      }

      if (supabase) {
        setIsSearching(true);
        try {
          const results = await bookingService.search({
            searchTerm: searchTerm || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            destination: destinationFilter !== 'all' ? destinationFilter : undefined,
            leadType: leadTypeFilter !== 'all' ? leadTypeFilter : undefined,
            service: serviceFilter !== 'all' ? serviceFilter : undefined,
            assignee: assigneeFilter !== 'all' ? assigneeFilter : undefined,
          });
          
          const frontendResults = results.map(convertDbBookingToFrontend);
          
          const resultsWithCommentsAndExpenses = await Promise.all(
            frontendResults.map(async (booking) => {
              const [comments, expenses] = await Promise.all([
                bookingCommentService.getByBookingId(booking.id),
                bookingExpenseService.getByBookingId(booking.id)
              ]);
              return {
                ...booking,
                comments: comments.map(comment => ({
                  id: comment.id,
                  text: comment.text,
                  userId: comment.user_id,
                  userName: comment.user_name,
                  timestamp: comment.created_at,
                })),
                expenses
              };
            })
          );
          
          setFilteredBookings(resultsWithCommentsAndExpenses);
        } catch (error) {
          console.error('Search error:', error);
          setFilteredBookings(bookings);
        } finally {
          setIsSearching(false);
        }
      } else {
        const filtered = bookings.filter(booking => {
          const matchesSearch = searchTerm === '' ||
            booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.phone.includes(searchTerm) ||
            booking.destination.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
          const matchesDestination = destinationFilter === 'all' || booking.destination === destinationFilter;
          const matchesLeadType = leadTypeFilter === 'all' || booking.leadType === leadTypeFilter;
          const matchesService = serviceFilter === 'all' || booking.service === serviceFilter;
          const matchesAssignee = assigneeFilter === 'all' || booking.assignee === assigneeFilter;

          return matchesSearch && matchesStatus && matchesDestination && matchesLeadType && matchesService && matchesAssignee;
        });
        setFilteredBookings(filtered);
      }
    };

    performSearch();
  }, [bookings, searchTerm, statusFilter, destinationFilter, leadTypeFilter, serviceFilter, assigneeFilter]);

  return {
    bookings: filteredBookings,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    destinationFilter,
    setDestinationFilter,
    leadTypeFilter,
    setLeadTypeFilter,
    serviceFilter,
    setServiceFilter,
    assigneeFilter,
    setAssigneeFilter,
    isSearching,
    destinationOptions,
    assigneeOptions,
  };
};
