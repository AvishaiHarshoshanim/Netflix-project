package views.user ;

public class User {
    private final String userName;
    private final String name;

    public User(String userName, String name) {
        this.userName = userName;
        this.name = name;
    }

    public String userName() {
        return userName;
    }

    public String getName() {
        return name;
    }
}
