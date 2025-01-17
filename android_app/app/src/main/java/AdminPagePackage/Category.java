package AdminPagePackage;

public class Category {
    private String name;
    private boolean promoted;

    public Category(String name, boolean promoted) {
        this.name = name;
        this.promoted = promoted;
    }

    public String getName() {
        return name;
    }

    public boolean isPromoted() {
        return promoted;
    }
}
