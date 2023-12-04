namespace MandarinApp.Interface
{
    public interface ICRUD<T>
    {
        T Get(int id);
        ICollection<T> GetList();
        void Change(int id, T newData);
        void Delete(int id);
        void DeleteBySheduller();
        void Add(T newData);
    }
}
