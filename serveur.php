<?php
class BDD
{
    private $pdo;
    
    public function __construct()
    {
        $this->pdo = new PDO("sqlite:bdd.db");
    }

    /**
     * Create table if not exits
     * @return bool table created
     */
    public function createTableComment(): bool
    {
        $sql = "CREATE TABLE IF NOT EXISTS CommentsSecond(
            id int primary key auto_increment,
            comment_parent int foreign key REFERENCES (id),
            content text
        )";
        $result= $this->pdo->query($sql);
        return $result;
    }

    public function select( $request )
    {
        $results = $this->pdo->query($request);
        if($results === false)
        {
            var_dump($this->pdo->errorInfo());
            return $results;
        }
        return $results->fetchAll();
    }

    // source code http://www.sqlitetutorial.net/sqlite-php/insert/
    public function prepare_insert( $request, $data ) {
        
        $statement = $this->pdo->prepare( $request );
        foreach($data as $key => $value)
        {
            $statement->bindValue(':'.$key, $value);
        }
        $statement->execute();
        return $this->pdo->lastInsertId();
    }
}
$pdo = new BDD();
$result = $pdo->select("SELECT * FROM Comments;");
header("content-Type: application/json");
echo (json_encode($result));